import { Configuration, OpenAIApi } from 'openai';
import inquirer from 'inquirer';
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const userId = "a0aef703-d59f-4624-af9f-f2717685b5ba"
// 
let messagesList = [
  { role: 'system', content: "你是一个node工程师" },
  { role: 'user', content: '请问if (delta?.role) 中的?. 代表什么意思' },
]
await chatCompletion()
process.exit()
function getQuestions(role) {
  return [{
    prefix: '',
    type: 'input',
    name: 'message',
    message: role + ":",
    validate: function (input) {
      const done = this.async();
      if (input == '') {
        done('消息不能为空');
        return;
      }
      done(null, true);
    }
  }]
}
async function chatCompletion() {
  messagesList = []
  const answer = await inquirer.prompt(getQuestions("system"))
  messagesList.push({ role: 'system', content: answer.message })
  // const answer = await input(questions);
  let maxRounds = 0
  let currentRounds = 0
  while (maxRounds == 0 || currentRounds < maxRounds) {
    const answer = await inquirer.prompt(getQuestions("user"))
    if (answer.message == "exit") {
      break
    }
    messagesList.push({ role: 'user', content: answer.message })
    await chatSendMessage()
    currentRounds++;
  }
  // console.log(messagesList)
  // console.log(completion.data.choices[0].message.role, ":", completion.data.choices[0].message.content);
}

async function chatSendMessage() {
  const stream = false
  let completionRequest = {
    model: 'gpt-3.5-turbo',
    user: userId,
    messages: messagesList
  }
  let axiosRequestConfig = {}
  if (stream) {
    axiosRequestConfig.responseType = 'stream'
    completionRequest.stream = true
  }
  const res = await openai.createChatCompletion(completionRequest, axiosRequestConfig)
  messagesList.push({ role: res.data.choices[0].message.role, content: res.data.choices[0].message.content })
  console.log(res.data.choices[0].message.role, ":", res.data.choices[0].message.content);
}
async function completion() {
  const stream = true
  let completionRequest = {
    model: "text-davinci-003",
    user: userId,
    prompt: "Hello world",
  }
  let axiosRequestConfig = {}
  if (stream) {
    axiosRequestConfig.responseType = 'stream'
    completionRequest.stream = true
  }
  try {
    const res = await openai.createChatCompletion(completionRequest, axiosRequestConfig)
    res.data.on('data', data => {
      const lines = data.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          return; // Stream finished
        }
        try {
          const parsed = JSON.parse(message);
          const choice = parsed.choices[0]
          if (choice.finish_reason == "stop") {
            return
          }
          if (choice.delta?.role) {
            process.stdout.write(choice.delta.role + ":\n")
          }
          if (choice.delta?.content) {
            process.stdout.write(choice.delta.content)
          }
        } catch (error) {
          console.error('Could not JSON parse stream message', message, error);
        }
      }
    });
  } catch (error) {
    if (error.response?.status) {
      console.error(error.response.status, error.response.message);
      if (stream) {
        error.response.data.on('data', data => {
          const message = data.toString();
          try {
            const parsed = JSON.parse(message);
            console.error('OpenAI 请求期间发生错误: ', parsed);
          } catch (error) {
            console.error('OpenAI 请求期间发生错误: ', message);
          }
        });
      } else {

      }
    } else {
      console.error('OpenAI 请求期间发生错误: ', error);
    }
  }
}


