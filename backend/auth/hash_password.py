from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# hashes passsword
def hash_password(password: str):
    password = password[:72]
    return pwd_context.hash(password)

# compare password with hashed password
def verify_password(password: str, hashed: str):
    password = password[:72]
    return pwd_context.verify(password, hashed)
