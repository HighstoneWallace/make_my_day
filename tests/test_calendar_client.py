import datetime
from unittest.mock import patch, MagicMock, mock_open


@patch("app.calendar_client.InstalledAppFlow")
@patch("app.calendar_client.os.path.isfile", return_value=False)
def test_get_credentials_no_token_file_runs_oauth(mock_isfile, mock_flow):
    mock_creds = MagicMock()
    mock_flow.from_client_secrets_file.return_value.run_local_server.return_value = mock_creds
    mock_creds.to_json.return_value = "{}"

    with patch("builtins.open", mock_open()):
        from app.calendar_client import get_credentials
        creds = get_credentials()

    mock_flow.from_client_secrets_file.assert_called_once()
    assert creds == mock_creds


@patch("app.calendar_client.Credentials")
@patch("app.calendar_client.os.path.isfile", return_value=True)
def test_get_credentials_valid_token_file(mock_isfile, mock_creds_cls):
    mock_creds = MagicMock()
    mock_creds.valid = True
    mock_creds_cls.from_authorized_user_file.return_value = mock_creds

    from app.calendar_client import get_credentials
    creds = get_credentials()

    mock_creds_cls.from_authorized_user_file.assert_called_once()
    assert creds == mock_creds


@patch("app.calendar_client.Request")
@patch("app.calendar_client.Credentials")
@patch("app.calendar_client.os.path.isfile", return_value=True)
def test_get_credentials_expired_token_refreshes(mock_isfile, mock_creds_cls, mock_request):
    mock_creds = MagicMock()
    mock_creds.valid = False
    mock_creds.expired = True
    mock_creds.refresh_token = "refresh-token"
    mock_creds.to_json.return_value = "{}"
    mock_creds_cls.from_authorized_user_file.return_value = mock_creds

    with patch("builtins.open", mock_open()):
        from app.calendar_client import get_credentials
        creds = get_credentials()

    mock_creds.refresh.assert_called_once()
    assert creds == mock_creds


@patch("app.calendar_client.build")
@patch("app.calendar_client.get_credentials")
def test_get_todays_events_returns_items(mock_get_creds, mock_build):
    mock_service = MagicMock()
    mock_build.return_value = mock_service

    fake_events = [
        {"summary": "Standup", "start": {"dateTime": "2026-06-27T09:00:00"}},
        {"summary": "Lunch", "start": {"dateTime": "2026-06-27T12:00:00"}},
    ]
    mock_service.events.return_value.list.return_value.execute.return_value = {
        "items": fake_events
    }

    from app.calendar_client import get_todays_events
    events = get_todays_events()

    assert len(events) == 2
    assert events[0]["summary"] == "Standup"
    mock_build.assert_called_once_with("calendar", "v3", credentials=mock_get_creds.return_value)


@patch("app.calendar_client.build")
@patch("app.calendar_client.get_credentials")
def test_get_todays_events_empty(mock_get_creds, mock_build):
    mock_service = MagicMock()
    mock_build.return_value = mock_service
    mock_service.events.return_value.list.return_value.execute.return_value = {"items": []}

    from app.calendar_client import get_todays_events
    events = get_todays_events()

    assert events == []


@patch("app.calendar_client.build")
@patch("app.calendar_client.get_credentials")
def test_get_tasks_returns_tasks_from_all_tasklists(mock_get_creds, mock_build):
    mock_service = MagicMock()
    mock_build.return_value = mock_service

    mock_service.tasklists.return_value.list.return_value.execute.return_value = {
        "items": [
            {"id": "list1", "title": "Work"},
            {"id": "list2", "title": "Personal"},
        ]
    }
    mock_service.tasks.return_value.list.return_value.execute.side_effect = [
        {"items": [{"title": "Write report", "due": "2026-06-28T00:00:00Z"}]},
        {"items": [{"title": "Buy groceries", "due": None}]},
    ]

    from app.calendar_client import get_tasks
    tasks = get_tasks()

    assert len(tasks) == 2
    titles = [t["title"] for t in tasks]
    assert "Write report" in titles
    assert "Buy groceries" in titles
    assert tasks[0]["tasklist"] == "Work"
    assert tasks[1]["tasklist"] == "Personal"


@patch("app.calendar_client.build")
@patch("app.calendar_client.get_credentials")
def test_get_tasks_empty_tasklists(mock_get_creds, mock_build):
    mock_service = MagicMock()
    mock_build.return_value = mock_service
    mock_service.tasklists.return_value.list.return_value.execute.return_value = {"items": []}

    from app.calendar_client import get_tasks
    tasks = get_tasks()

    assert tasks == []
