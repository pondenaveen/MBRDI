from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.utils.exception import NotFoundException


from app.api.user.routes import router as users_router
from app.api.integration.routes import router as integration_routes
# from app.api.assets.routes import router as asset_router
# from app.api.office.routes import router as office_router

app = FastAPI(
    title="MBRDI IAQ MONITORING",
    description="API for Asset management",
    version="0.0.1",
    author="Ponde Naveen",
    author_email=""
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://164.52.197.111:3001", "http://164.52.197.111:3002"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(integration_routes, prefix="/integration", tags=["Integration"])

from app.api.config.connect import start_subscribe
@app.on_event("startup")
async def startup_event():
    start_subscribe()
if __name__ == "__main__":
    start_subscribe()






# Exception Handlers
@app.exception_handler(NotFoundException)
async def not_found_exception_handler(request, exc: NotFoundException):
    return JSONResponse(
        status_code=404,
        content={"message": f"{exc.item_type} with ID {exc.item_id} not found"},
    )
