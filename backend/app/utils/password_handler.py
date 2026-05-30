import bcrypt

class PasswordHandler:
    @staticmethod
    def hash_password(password: str) -> str:
        # Generate a secure salt and hash the password bytes
        salt = bcrypt.gensalt(rounds=10)
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            # Check password by encoding inputs to bytes
            return bcrypt.checkpw(
                plain_password.encode('utf-8'), 
                hashed_password.encode('utf-8')
            )
        except Exception:
            return False
