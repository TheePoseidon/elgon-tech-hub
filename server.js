const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDirectory = path.join(__dirname, "data");
const messagesFilePath = path.join(dataDirectory, "messages.json");
if (!fs.existsSync(dataDirectory)) {
	fs.mkdirSync(dataDirectory, { recursive: true });
}
if (!fs.existsSync(messagesFilePath)) {
	fs.writeFileSync(messagesFilePath, "[]", "utf-8");
}

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Health endpoint
app.get("/api/health", (req, res) => {
	res.json({ status: "ok" });
});

// NOTE: You need to install nodemailer first with: npm install nodemailer
// Configure email transporter
let transporter;
try {
	transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER || 'elgontechhub@gmail.com',
			pass: process.env.EMAIL_PASS // Set this as an environment variable for security
		}
	});
} catch (error) {
	console.error('Error setting up email transporter:', error);
	// Create a mock transporter for development
	transporter = {
		sendMail: (options) => {
			console.log('Email would be sent with these options:', options);
			return Promise.resolve({ response: 'Email sending simulated (nodemailer not installed)' });
		}
	};
}

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
	const { name, email, message } = req.body || {};

	const isNonEmptyString = (val) => typeof val === "string" && val.trim().length > 0;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
		return res.status(400).json({ error: "All fields are required." });
	}
	if (!emailRegex.test(email)) {
		return res.status(400).json({ error: "Please provide a valid email." });
	}

	const newEntry = {
		id: Date.now(),
		name: name.trim(),
		email: email.trim().toLowerCase(),
		message: message.trim(),
		receivedAt: new Date().toISOString()
	};

	try {
		// Save to file
		const fileContent = fs.readFileSync(messagesFilePath, "utf-8");
		const messages = JSON.parse(fileContent || "[]");
		messages.push(newEntry);
		fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
		
		// Send email
		const mailOptions = {
			from: `"Elgon Tech Hub Website" <noreply@elgontechhub.com>`,
			to: 'elgontechhub@gmail.com',
			replyTo: email,
			subject: `New Contact Form Submission from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
			html: `
				<h2>New Contact Form Submission</h2>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong></p>
				<p>${message.replace(/\n/g, '<br>')}</p>
			`
		};
		
		try {
			await transporter.sendMail(mailOptions);
			console.log('Email sent successfully to elgontechhub@gmail.com');
		} catch (emailError) {
			console.error('Error sending email:', emailError);
			// Continue execution even if email fails - we've saved the message to file
		}
		
		return res.status(201).json({ success: true });
	} catch (error) {
		console.error("Failed to process contact message:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Fallback: send index.html for unknown routes under /
app.get(/^(?!\/api\/).*/, (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
	console.log(`Elgon Tech Hub server running on http://localhost:${PORT}`);
});


