# Commando Login Credentials

## How Commandos Login

**Important:** Commandos login using their **Commando ID** as the username.

### Login Format:
- **Username:** Commando ID (e.g., `COMMANDO-001`, `testing`)
- **Password:** The password set during registration

### Example:
If you create a commando with:
- Commando ID: `COMMANDO-001`
- Password: `commando123`

Then login with:
- Username: `COMMANDO-001`
- Password: `commando123`

---

## Current Commandos in Database

Run this command to see all commando credentials:
```bash
npm run list-commandos
```

---

## Creating a New Commando

1. Login as **Admin** (username: `admin`, password: `admin123`)
2. Go to **Admin Dashboard → Commandos**
3. Click **"Register New Commando"**
4. Fill in the form:
   - **Commando ID** (this becomes the username)
   - **Name**
   - **Email**
   - **Phone** (optional)
   - **Password** (remember this!)
5. Click **"Register Commando"**
6. **Save the credentials:**
   - Username = Commando ID
   - Password = What you entered

---

## Important Notes

- ✅ Commando ID = Login Username
- ✅ Password is encrypted in database (cannot be retrieved)
- ✅ If you forget password, you need to reset it via Admin Dashboard
- ✅ Only Commandos can login (Fighters cannot login)

---

## Quick Test Commando

To create a test commando with known credentials:
```bash
npm run create-test-commando
```

This creates:
- Commando ID: `COMMANDO-001`
- Username: `COMMANDO-001`
- Password: `commando123`

---

## View All Commandos

```bash
npm run list-commandos
```

This shows all commandos with their Commando IDs (usernames), but passwords are encrypted so they won't be shown.

