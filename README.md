# n8n-nodes-whatsapp-green-api-enhanced

[![npm version](https://badge.fury.io/js/n8n-nodes-whatsapp-green-api-enhanced.svg)](https://www.npmjs.com/package/n8n-nodes-whatsapp-green-api-enhanced)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-whatsapp-green-api-enhanced.svg)](https://www.npmjs.com/package/n8n-nodes-whatsapp-green-api-enhanced)

Enhanced n8n community nodes for WhatsApp automation using Green API with advanced filtering capabilities.

## 🌟 Features

- **Send Messages**: Text, files, contacts, locations and more
- **Group Management**: Create, manage and control WhatsApp groups  
- **Smart Trigger**: Receive webhooks with advanced filtering options
- **Chat Operations**: History, archiving and management
- **Hebrew Support**: Full Hebrew language support
- **AI Agent Ready**: Compatible with n8n AI agents

## 📦 Installation

### Via n8n Community Nodes (Recommended)
1. Go to **Settings** → **Community Nodes** in your n8n instance
2. Click **Install**
3. Enter: `n8n-nodes-whatsapp-green-api-enhanced`
4. Click **Install**

### Via npm
```bash
npm install n8n-nodes-whatsapp-green-api-enhanced
```

## 🚀 Quick Start

### 1. Setup Green API Account
1. Create account at [Green API](https://green-api.com/)
2. Create a new instance
3. Get your Instance ID and API Token
4. Scan QR code with your WhatsApp

### 2. Configure Credentials in n8n
1. Add **Green API** credentials
2. Enter your Instance ID and API Token
3. Test the connection

### 3. Use the Nodes
- **Green API**: Send messages, manage groups, get chat history
- **Green API Trigger**: Receive incoming messages with filtering

## 📚 Available Nodes

### 🔹 Green API (Send Operations)
Send messages, manage groups, and perform WhatsApp operations.

**Resources:**
- **Message**: Send text, files, contacts, locations
- **Group**: Create and manage groups
- **Chat**: Get history and manage conversations

### 🔸 Green API Trigger (Receive Operations)  
Advanced webhook receiver with filtering capabilities.

**Filter Options:**
- Event types (messages, status changes, etc.)
- Specific chat IDs
- Message types (text, image, video, etc.)
- Keywords in message content

## 💡 Usage Examples

### Send a Simple Message
```
Resource: Message
Operation: Send
Chat ID: 972501234567@c.us
Message: Hello from n8n!
```

### Smart Message Trigger
```
Event Types: message
Chat Filter: 972501234567@c.us  
Message Type: Text Messages Only
Keywords: help, support, order
```

### Create WhatsApp Group
```
Resource: Group
Operation: Create Group
Group Name: Project Team
Participants: 972501234567@c.us,972501234568@c.us
```

## 🔧 Chat ID Formats

| Type | Format | Example |
|------|--------|---------|
| **Private** | `{phone}@c.us` | `972501234567@c.us` |
| **Group** | `{groupId}@g.us` | `972501234567-1587570015@g.us` |

## 📱 Supported Operations

### Message Operations
- Send text messages
- Send files by URL
- Send contacts  
- Send locations
- Get chat history

### Group Operations
- Create groups
- Get group information
- Manage participants

### Trigger Events
- Incoming messages
- Message status updates
- Session status changes
- Group updates

## 🚨 Troubleshooting

### "Instance not authorized"
**Solution**: Scan the QR code again in Green API console

### "Invalid Chat ID"  
**Solution**: Ensure correct format:
- Private: `972501234567@c.us`
- Group: Use full Group ID

### Messages not received in Trigger
**Solution**:
1. Check webhook URL is correct
2. Verify filter settings
3. Ensure instance is active

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. **Report bugs** - Open an issue
2. **Suggest features** - Open a feature request  
3. **Submit code** - Open a pull request
4. **Improve docs** - Help enhance documentation

### Development Setup
```bash
# Clone repository
git clone https://github.com/dacho2025/n8n-nodes-whatsapp-green-api-enhanced.git

# Install dependencies
npm install

# Build
npm run build

# Develop with watch mode
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/n8n-nodes-whatsapp-green-api-enhanced)
- [Green API Documentation](https://green-api.com/docs/)
- [n8n Documentation](https://docs.n8n.io/)
- [Issues & Support](https://github.com/dacho2025/n8n-nodes-whatsapp-green-api-enhanced/issues)

## 🙏 Acknowledgments

- Built for the Israeli n8n community
- Powered by [Green API](https://green-api.com/)
- Made with ❤️ for the n8n ecosystem

---

**If this package helped you, please give it a ⭐ on GitHub!**