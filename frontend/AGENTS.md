# Agent Guidelines for Haihuozhe

## Build & Test Commands

**Backend (FastAPI):**
```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app:app --reload

# Run tests (all)
pytest test_api.py -v

# Run single test
pytest test_api.py::test_read_root -v

# Run with coverage (if available)
pytest --cov=. test_api.py
```

**Frontend (uni-app):**
- Built with HBuilderX IDE (no CLI build)
- Run: Open project in HBuilderX and use Run/Build menus

## Code Style Guidelines

### Backend (Python/FastAPI)
- **Imports**: Group order - standard library → third-party → local modules
- **Naming**: snake_case for functions/variables, PascalCase for classes
- **Type hints**: Required for all functions (use Optional for nullable)
- **Models**: All data models inherit from pydantic.BaseModel
- **Async**: Use async/await for all I/O operations
- **Error handling**: Raise HTTPException(status_code, detail) for API errors
- **Logging**: Use `logger = logging.getLogger(__name__)` at module level
- **API routes**: RESTful design, path params use `{param}`, query params in function args

### Frontend (Vue 3/uni-app)
- **Imports**: Use ES6 imports, alias `@/` for project root
- **Components**: Use camelCase for component names in template
- **State**: Use uni.getStorageSync/setStorageSync for persistence
- **API calls**: Use centralized api-service.js class
- **Error handling**: try/catch blocks with console.error, user-facing messages via uni.showToast
- **Navigation**: uni.navigateTo() for page transitions, uni.switchTab() for tab pages
- **Custom navbar**: Set `"navigationStyle": "custom"` in pages.json, use custom-nav-bar component
- **Style**: Scoped styles in <style> tags, use flexbox for layouts

## Project Structure
- `backend/app.py`: Main FastAPI application with all routes
- `backend/models/`: Pydantic data models
- `backend/db/`: Data persistence layer
- `backend/services/`: Push notification services (follow ADD_NEW_RULE.md for adding new services)
- `pages/`: uni-app page components
- `common/`: Shared utilities (api-service.js, checkin-utils.js)
- `static/`: Static assets and config.js

## Key Patterns
- Backend uses app.state for dependency injection (user_storage, timeout_checker, scheduler)
- Frontend generates UUID for users if not exists, stores in uni.getStorageSync('user_id')
- Timeout checking runs every minute via APScheduler
- All push services inherit from BasePushService
