import hashlib

password = "my_secret_password"
hashed = hashlib.sha256(password.encode()).hexdigest()

print("Original:", password)
print("SHA-256 Hash:", hashed)

# Verify
verify_password = "my_secret_aspassword"
verify_hashed = hashlib.sha256(verify_password.encode()).hexdigest()

if verify_hashed == hashed:
    print("Password verified successfully!")
else:
    print("Password verification failed.")