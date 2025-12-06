from cryptography.fernet import Fernet

# Generate Key
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt
message = "Hello Encryption!"
token = cipher.encrypt(message.encode())

# Decrypt
decrypted = cipher.decrypt(token).decode()

print("Key:", key)
print("Encrypted:", token)
print("Decrypted:", decrypted)
