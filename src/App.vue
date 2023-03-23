<template>
  <div class="chat-container" :style="{ height: chatHeight + 'px', width: chatWidth + 'px' }">
    <div class="chat-header">OpenAI Chat</div>
    <div class="chat-messages" ref="messages">
      <div v-for="message in messages" :key="message.id"
        :class="{ 'message-sent': message.role === 'user', 'message-received': message.role != 'user' }">
        <div class="message-text">{{ message.content }}</div>
        <div class="message-time">{{ message.time }}</div>
      </div>
    </div>
    <div class="chat-input" ref="input">
      <input type="text" placeholder="Type your message..." v-model="newMessage" @keyup.enter="sendMessage">
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        { id: 0, role: 'system', content: "你是chatGPT", time: '9:00 AM' },
        { id: 1, role: 'user', content: "你是谁", time: '9:00 AM' },
        { id: 2, role: 'assistant', content: "我是openai创造的chatGPT", time: '9:00 AM' },
        
      ],
      newMessage: '',
    };
  },
  methods: {
    sendMessage() {
      const newMsg = {
        id: this.messages.length + 1,
        content: this.newMessage,
        role: 'user',
        time: new Date().toLocaleTimeString(),
      };
      this.messages.push(newMsg);
      this.newMessage = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
    },
    calculateChatHeight() {
      this.chatHeight = window.innerHeight - this.$refs.messages.offsetTop - this.$refs.input.offsetHeight;
      this.chatWidth= this.$el.offsetWidth;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateChatHeight();
    });
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        this.calculateChatHeight();
      });
    },
  },
};
</script>

<style>
.chat-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
}

.chat-header {
  padding: 16px;
  background-color: #3f51b5;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.chat-messages {
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-rows: repeat(auto-fill, minmax(50px, auto));
  grid-gap: 16px;
}

.message {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 8px;
  padding: 8px;
  border-radius: 8px;
}

.message-sent {
  justify-self: end;
  /* background-color: #f5f5f5; */
}

.message-received {
  justify-self: start;
  /* background-color: #fff; */
}

.message-text {
  font-size: 16px;
  font-weight: 500;
}

.message-time {
  color: #ccc;
  font-size: 12px;
}

.chat-input {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 16px;
  background-color: #f2f2f2;
}

.chat-input input[type='text'] {
  height: 100%;
  padding: 8px;
  border: none;
  border-radius: 4px;
}

.chat-input button {
  padding: 8px 16px;
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.chat-input button:hover {
  background-color: #2c3e50;
}
</style>