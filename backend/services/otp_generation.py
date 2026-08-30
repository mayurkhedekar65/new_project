import secrets

# generates otp of 4 digits
def generate_otp():
    random_num = str(secrets.randbelow(9000)+(1000))
    return random_num


# creates otp key
def otp_key(email):
    return f"otpkey:{email}"
