from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL:str
    APP_NAME = "TravelSphere"
    DEBUG:bool=False
    
    config_model = SettingsConfigDict(
        env_file =".env",
        env_file_encodings="utf-8",
    )
    

settings = Settings()