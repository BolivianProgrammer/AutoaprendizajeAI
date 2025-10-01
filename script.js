// Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.querySelector('.chat-container');
const welcomeMessage = document.querySelector('.welcome-message');
const newChatButton = document.querySelector('.new-chat');

// API Key (in a real application, this should be securely stored on a server)
const API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key

// Chat history
let chatHistory = [];

// Event listeners
chatForm.addEventListener('submit', handleSubmit);
newChatButton.addEventListener('click', startNewChat);

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Remove welcome message if it's still there
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    // Add user message to UI
    addMessageToUI('user', message);
    
    // Clear input field
    userInput.value = '';
    
    // Add user message to chat history
    chatHistory.push({ role: 'user', content: message });
    
    // Show thinking indicator
    const thinkingElement = addThinkingIndicator();
    
    try {
        // Get response from OpenAI API
        const response = await getOpenAIResponse();
        
        // Remove thinking indicator
        thinkingElement.remove();
        
        // Add bot response to UI
        const botMessage = response.choices[0].message.content;
        addMessageToUI('bot', botMessage);
        
        // Add bot response to chat history
        chatHistory.push({ role: 'assistant', content: botMessage });
        
        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        // Remove thinking indicator
        thinkingElement.remove();
        
        // Show error message
        addMessageToUI('bot', 'Sorry, I encountered an error. Please try again.');
        console.error('Error:', error);
    }
}

// Add message to UI
function addMessageToUI(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    
    const avatar = document.createElement('img');
    avatar.classList.add('message-avatar');
    avatar.src = sender === 'user' ? './assets/user.svg' : './assets/bot.svg';
    avatar.alt = sender === 'user' ? 'User Avatar' : 'Bot Avatar';
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatContainer.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add thinking indicator
function addThinkingIndicator() {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.classList.add('message', 'bot-message');
    
    const avatar = document.createElement('img');
    avatar.classList.add('message-avatar');
    avatar.src = './assets/bot.svg';
    avatar.alt = 'Bot Avatar';
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = 'Thinking...';
    
    thinkingDiv.appendChild(avatar);
    thinkingDiv.appendChild(messageContent);
    
    chatContainer.appendChild(thinkingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return thinkingDiv;
}

// Get response from OpenAI API
async function getOpenAIResponse() {
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                ...chatHistory
            ]
        })
    };
    
    const response = await fetch(API_URL, requestOptions);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Failed to get response from OpenAI');
    }
    
    return response.json();
}

// Start a new chat
function startNewChat() {
    chatHistory = [];
    chatContainer.innerHTML = `
        <div class="welcome-message">
            <h1>ChatGPT</h1>
            <p>How can I help you today?</p>
        </div>
    `;
}