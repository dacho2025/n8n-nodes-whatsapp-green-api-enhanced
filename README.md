![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-whatsapp-green-api-enhanced

🚀 **Enhanced WhatsApp integration for n8n with comprehensive media handling and advanced trigger system**

ספריית נודים משופרת עבור Green API ל-n8n עם תמיכה מלאה במדיה, 27 אירועים, ופילטרים מתקדמים

## ✨ תכונות מתקדמות

- 🎯 **6 נודים מיוחדים** לכל סוג פעולה
- 🔥 **27 סוגי אירועים** בטריגר המשופר  
- 🎵 **תמיכה מלאה במדיה**: קול, תמונות, דוקומנטים, וידאו
- 🎛️ **פילטרים חכמים**: מילות מפתח, סוג צ'אט, אורך הודעה
- 🤖 **זיהוי אוטומטי** של סוג קובץ מדיה
- 📁 **Binary Data Support** מלא

## 📦 הנודים הזמינים

### 1. 🎯 Green API (נוד ראשי)
פעולות WhatsApp בסיסיות:
- **הודעות**: שליחה, עריכה ומחיקה של הודעות
- **קבוצות**: יצירה וניהול של קבוצות WhatsApp  
- **צ'אטים**: קבלת היסטוריית צ'אט
- **אנשי קשר**: קבלת רשימת אנשי קשר
- **קבצים**: שליחה בהעלאה או URL

### 2. 🚨 Green API Trigger (טריגר מתקדם)
webhook מתקדם עם 27 אירועים:
- ✅ `incomingMessageReceived` - הודעות נכנסות
- ✅ `outgoingMessageReceived` - אישור הודעות יוצאות
- ✅ `outgoingMessageStatus` - סטטוס הודעות
- ✅ `stateInstanceChanged` - שינוי מצב instance
- ✅ `statusInstanceChanged` - שינוי סטטוס instance
- ✅ `deviceInfo` - מידע מכשיר
- ✅ `incomingCall` / `outgoingCall` - שיחות נכנסות ויוצאות
- ✅ `avatarInfo` - עדכון תמונת פרופיל
- ✅ `contacts` - עדכון אנשי קשר
- ✅ `chatHistory` - היסטוריית צ'אט
- ✅ `presenceUpdate` - סטטוס נוכחות
- ✅ `groupParticipantsChanged` - שינוי משתתפי קבוצה
- ✅ `groupCreated` / `groupUpdated` / `groupLeft` - אירועי קבוצות
- ✅ `quotasInfo` - מידע מכסות
- ✅ `messageDeleted` - מחיקת הודעות
- ✅ **אירועי מדיה**: `audioMessage`, `videoMessage`, `imageMessage`, `documentMessage`, `stickerMessage`, `locationMessage`, `contactMessage`, `pollMessage`

### 3. 💬 Green API Message Trigger (טריגר פשוט)
טריגר ממוקד במיוחד להודעות:
- 🎯 **רק הודעות** - ללא אירועים נוספים
- 🔤 **פילטר סוג הודעה**: טקסט, תמונות, קול, וידאו
- 💬 **פילטר צ'אט**: פרטי/קבוצתי
- 🔍 **מילות מפתח** פשוטות
- 🤖 **החרגת בוט** אוטומטית

### 4. 🎵 Green API Get Voice
הורדה ועיבוד הודעות קול:
- הורדה ממספר מקורות (Message ID, URL, נוד קודם)
- שמות קבצים מותאמים אישית
- חילוץ metadata מפורט
- טיפול בשגיאות מתקדם

### 5. 📄 Green API Get Document  
הורדה ועיבוד דוקומנטים:
- תמיכה בכל סוגי הקבצים (PDF, Word, Excel, וכו')
- פילטור לפי סוג קובץ
- הגבלות גודל קובץ
- חילוץ טקסט מדוקומנטים נתמכים

### 6. 🖼️ Green API Get Image
הורדה ועיבוד תמונות:
- תמיכה בכל פורמטי התמונות
- יצירת thumbnails
- חילוץ EXIF data
- שינוי גודל תמונות
- תמיכה בכיתובים

### 7. 🎬 Green API Get Video
הורדה ועיבוד סרטונים:
- תמיכה בכל פורמטי הוידאו
- יצירת thumbnails מהסרטון
- דחיסת וידאו
- חילוץ metadata (רזולוציה, משך, וכו')
- הגבלות משך ומשקל

## 🛠️ התקנה

### התקנה מקומית
```bash
# בתיקיית n8n (בדרך כלל ~/.n8n/custom)
npm install n8n-nodes-whatsapp-green-api-enhanced

# התחל מחדש את n8n
```

### התקנה עם Docker
```bash
NODE_EXTRA_PACKAGES=n8n-nodes-whatsapp-green-api-enhanced
```

## 🔧 הגדרה

### 1. Green API Credentials
1. הירשם ב-[Green API](https://green-api.com)
2. צור instance וקבל:
   - **Instance ID**: מספר ה-instance שלך
   - **API Token**: הטוקן המיוחד שלך
3. הוסף credentials ב-n8n

### 2. Webhook Configuration
לטריגר:
1. הוסף נוד **Green API Trigger**
2. העתק את כתובת הwebhook
3. הגדר בGreen API Dashboard

## 📋 דוגמאות Workflow

### 1. עיבוד הודעות קול → טקסט
```
Green API Trigger (audioMessage) 
    ↓
Green API Get Voice (הורדה)
    ↓  
OpenAI Whisper (תמלול)
    ↓
Green API (שליחת תשובה)
```

### 2. נתב חכם למדיה
```
Green API Trigger (כל סוגי המדיה)
    ↓
Switch Node (לפי messageType)
    ├── audioMessage → Green API Get Voice
    ├── imageMessage → Green API Get Image  
    ├── documentMessage → Green API Get Document
    └── videoMessage → Green API Get Video
```

### 3. עיבוד דוקומנטים
```
Green API Trigger (documentMessage)
    ↓
Green API Get Document
    ↓
PDF Text Extraction
    ↓
OpenAI Analysis
    ↓
Green API (שליחת סיכום)
```

### 4. בוט שירות לקוחות
```
Green API Trigger (פילטר: "עזרה", "תמיכה")
    ↓
Get Customer Data
    ↓
Generate Response
    ↓
Green API (שליחת מענה)
```

## 🎛️ פילטרים מתקדמים

### בטריגר:
- 🔤 **מילות מפתח**: סינון לפי מילים מסוימות
- 💬 **סוג צ'אט**: פרטי / קבוצתי / הכל
- 📏 **אורך הודעה**: מינימום ומקסימום תווים
- 👤 **שולח ספציפי**: רק ממשתמש מסוים
- 🤖 **זיהוי אוטומטי**: מדיה וסוג קובץ

### בנודי מדיה:
- 📁 **סוג קובץ**: פילטור לפי סיומת
- ⚖️ **גודל קובץ**: הגבלת משקל מקסימלי
- 🎯 **שמות מותאמים**: placeholder variables
- 📊 **Metadata**: חילוץ מידע מפורט

## 🔧 Placeholder Variables
השתמש בשמות קבצים:
- `{timestamp}` - חותמת זמן נוכחית
- `{messageId}` - מזהה הודעת WhatsApp
- `{chatId}` - מזהה הצ'אט
- `{originalName}` - שם הקובץ המקורי

דוגמה: `voice_{timestamp}_{chatId}.ogg`

## ⚠️ בעיות ידועות

### שגיאת Credentials (ויזואלית בלבד)
כשמזינים את פרטי ההתחברות, עלולה להופיע שגיאה אדומה. 
**פתרון**: התעלם - הcredentials נשמרים ופועלים תקין.

### שימוש כ-AI Tool
להוספת `usableAsTool: true` לנודים לשימוש עם AI Agent.

## 🔗 קישורים חשובים

- [Green API Documentation](https://green-api.com/en/docs/)
- [GitHub Repository](https://github.com/dacho2025/n8n-nodes-whatsapp-green-api-enhanced)
- [NPM Package](https://www.npmjs.com/package/n8n-nodes-whatsapp-green-api-enhanced)

## 🛠️ פיתוח

```bash
# שכפל את הפרויקט
git clone https://github.com/dacho2025/n8n-nodes-whatsapp-green-api-enhanced.git

# התקן תלויות
cd n8n-nodes-whatsapp-green-api-enhanced
pnpm install

# בנה את הפרויקט
pnpm build

# קשר מקומית לבדיקות  
pnpm link
```

## 📋 דרישות מערכת

- ✅ n8n גירסה 0.200.0 ומעלה
- ✅ Node.js 16.0.0 ומעלה  
- ✅ חשבון Green API פעיל
- ✅ Instance מאושר ב-WhatsApp

## 🤝 תרומה לפרויקט

תרומות מתקבלות בברכה! אנא קרא את הנחיות התרומה לפני שליחת Pull Request.

## 📄 רישיון

[MIT License](LICENSE.md) - ראה קובץ הרישיון לפרטים מלאים.

---

**🔔 הערה חשובה**: הפרויקט משפר את יכולות האוטומציה של WhatsApp. אנא ודא עמידה בתנאי השירות של WhatsApp וחוקי הפרטיות הרלוונטיים בעת השימוש בנודים אלה.

**Made with ❤️ for the n8n community**