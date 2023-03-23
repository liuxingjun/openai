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
      <input type="text" :placeholder="input.placeholder" v-model="newMessage" :disabled="input.disabled"
        @keyup.enter="sendMessage">
      <button type="button" :disabled="input.disabled" @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { Configuration, OpenAIApi } from 'openai';
export default {
  data() {
    return {
      messages: [
        // { id: 0, role: 'system', content: "你是chatGPT", time: '9:00 AM' },
        // { id: 1, role: 'user', content: "你是谁", time: '9:00 AM' },
        // { id: 2, role: 'assistant', content: "我是openai创造的chatGPT", time: '9:00 AM' },
      ],
      newMessage: '',
      input: {
        placeholder: "请输入消息",
        disabled: false,
        button: "发送",
      },
      openai_api_key: ""
    };
  },
  props: {
    // openai_api_key: { default: '' }
  },
  methods: {
    sending() {
      this.input.disabled = true;
      this.input.button = "发送中...";
    },
    sendEnd() {
      this.input.disabled = false;
      this.input.button = "发送";
    },
    notKey() {
      this.input.disabled = true;
      this.input.placeholder = "未设置openai_api_key";
    },
    async sendMessage() {
      this.sending()
      const newMsg = {
        id: this.messages.length + 1,
        content: this.newMessage,
        role: 'user',
        time: new Date().toLocaleString(),
      };
      this.messages.push(newMsg);
      this.newMessage = '';

      let completionRequest = {
        model: 'gpt-3.5-turbo',
        user: this.userId,
        messages: this.messages
      }
      let axiosRequestConfig = { timeout: 0 }
      const res = await this.openai.createChatCompletion(completionRequest, axiosRequestConfig)
      messagesList.push({
        id: this.messages.length + 1,
        role: res.data.choices[0].message.role,
        content: res.data.choices[0].message.content,
        time: new Date().toLocaleString(),
      })
      // console.log(res.data.choices[0].message.role, ":", res.data.choices[0].message.content);
      this.send()
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
    },
    calculateChatHeight() {
      this.chatHeight = window.innerHeight - this.$refs.messages.offsetTop - this.$refs.input.offsetHeight;
      this.chatWidth = this.$el.offsetWidth;
    },
    initOpenAi() {
      if (this.openai_api_key == null || this.openai_api_key == "") {
        console.error("未设置openai_api_key")
        this.notKey()
        return
      }
      const configuration = new Configuration({
        apiKey: this.openai_api_key,
      });
      this.openai = new OpenAIApi(configuration);
    }
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    this.openai_api_key = urlParams.get('openai_api_key')

    this.initOpenAi()

    const userId = "a0aef703-d59f-4624-af9f-f2717685b5ba"

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

.chat-input button:hover:enabled {
  background-color: #2c3e50;
}

.chat-input button:disabled {
  background-color: #ccc;
  color: #888;
  cursor: not-allowed;
}
</style>