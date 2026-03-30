import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DSE Speaking Phrases by difficulty level (1-5)
// Level 1: Beginner
const level1Phrases = [
  { phrase: "Good morning", translation: "早上好", phonetic: "/ɡʊd ˈmɔːnɪŋ/", exampleSentence: "Good morning! How are you today?" },
  { phrase: "Thank you", translation: "谢谢", phonetic: "/θæŋk juː/", exampleSentence: "Thank you for your help." },
  { phrase: "You're welcome", translation: "不客气", phonetic: "/jɔːr ˈwelkəm/", exampleSentence: "You're welcome, it was my pleasure." },
  { phrase: "Excuse me", translation: "对不起/打扰一下", phonetic: "/ɪkˈskjuːz miː/", exampleSentence: "Excuse me, can you tell me the time?" },
  { phrase: "I'm sorry", translation: "对不起", phonetic: "/aɪm ˈsɒri/", exampleSentence: "I'm sorry for being late." },
  { phrase: "How are you", translation: "你好吗", phonetic: "/haʊ ɑːr juː/", exampleSentence: "Hi John, how are you doing?" },
  { phrase: "See you tomorrow", translation: "明天见", phonetic: "/siː juː təˈmɒroʊ/", exampleSentence: "I have to go now, see you tomorrow!" },
  { phrase: "What's your name", translation: "你叫什么名字", phonetic: "/wʌts jɔːr neɪm/", exampleSentence: "Hi, what's your name?" },
  { phrase: "My name is", translation: "我的名字是", phonetic: "/maɪ neɪm ɪz/", exampleSentence: "My name is Anna, nice to meet you." },
  { phrase: "Nice to meet you", translation: "很高兴认识你", phonetic: "/naɪs tuː miːt juː/", exampleSentence: "Nice to meet you too." },
  { phrase: "How much is it", translation: "这个多少钱", phonetic: "/haʊ mʌtʃ ɪz ɪt/", exampleSentence: "Excuse me, how much is this shirt?" },
  { phrase: "Where is the bathroom", translation: "洗手间在哪里", phonetic: "/wer ɪz ðə ˈbæθruːm/", exampleSentence: "Can you tell me where the bathroom is?" },
  { phrase: "I don't understand", translation: "我不明白", phonetic: "/aɪ doʊnt ˌʌndərˈstænd/", exampleSentence: "I'm sorry, I don't understand what you mean." },
  { phrase: "Can you repeat that", translation: "你能再说一遍吗", phonetic: "/kæn juː rɪˈpiːt ðæt/", exampleSentence: "I didn't catch that, can you repeat that?" },
  { phrase: "What time is it", translation: "现在几点", phonetic: "/wʌt taɪm ɪz ɪt/", exampleSentence: "Excuse me, what time is it?" }
];

// Level 2: Elementary
const level2Phrases = [
  { phrase: "Could you help me", translation: "你能帮我吗", phonetic: "/kʊd juː help miː/", exampleSentence: "Could you help me carry these bags?" },
  { phrase: "I'm looking for", translation: "我正在找", phonetic: "/aɪm ˈlʊkɪŋ fɔːr/", exampleSentence: "Excuse me, I'm looking for the nearest station." },
  { phrase: "How do I get to", translation: "我怎么去", phonetic: "/haʊ duː aɪ get tuː/", exampleSentence: "How do I get to the city centre from here?" },
  { phrase: "I'd like to", translation: "我想要", phonetic: "/aɪd laɪk tuː/", exampleSentence: "I'd like to order a coffee, please." },
  { phrase: "What do you think", translation: "你觉得怎么样", phonetic: "/wʌt duː juː θɪŋk/", exampleSentence: "What do you think about this plan?" },
  { phrase: "Do you mind if", translation: "你介意我...吗", phonetic: "/duː juː maɪnd ɪf/", exampleSentence: "Do you mind if I open the window?" },
  { phrase: "I don't think so", translation: "我不这么认为", phonetic: "/aɪ doʊnt θɪŋk soʊ/", exampleSentence: "I don't think so, that's not right." },
  { phrase: "I agree with you", translation: "我同意你的看法", phonetic: "/aɪ əˈɡriː wɪð juː/", exampleSentence: "I agree with you completely on this issue." },
  { phrase: "How was your day", translation: "你今天过得怎么样", phonetic: "/haʊ wʌz jɔːr deɪ/", exampleSentence: "Hi honey, how was your day at work?" },
  { phrase: "I'm tired", translation: "我累了", phonetic: "/aɪm ˈtaɪərd/", exampleSentence: "I'm really tired after working all day." },
  { phrase: "What's the matter", translation: "怎么了", phonetic: "/wʌts ðə ˈmætər/", exampleSentence: "You look sad, what's the matter?" },
  { phrase: "It doesn't matter", translation: "没关系", phonetic: "/ɪt ˈdʌzənnt ˈmætər/", exampleSentence: "It doesn't matter, we can do it tomorrow." },
  { phrase: "Let me see", translation: "让我想想", phonetic: "/let miː siː/", exampleSentence: "Let me see, where did I put my keys?" },
  { phrase: "Tell me about", translation: "跟我说说", phonetic: "/tel miː əˈbaʊt/", exampleSentence: "Tell me about your holiday." },
  { phrase: "I'm afraid", translation: "恐怕", phonetic: "/aɪm əˈfreɪd/", exampleSentence: "I'm afraid I can't come to the party." }
];

// Level 3: Intermediate
const level3Phrases = [
  { phrase: "On the other hand", translation: "另一方面", phonetic: "/ɑːn ði ˈʌðər hænd/", exampleSentence: "On the other hand, we could postpone the meeting until next week." },
  { phrase: "As far as I know", translation: "据我所知", phonetic: "/æz fɑːr æz aɪ noʊ/", exampleSentence: "As far as I know, the train should arrive on time." },
  { phrase: "To be honest", translation: "老实说", phonetic: "/tuː biː ˈɑːnɪst/", exampleSentence: "To be honest, I don't really like this idea." },
  { phrase: "In my opinion", translation: "在我看来", phonetic: "/ɪn maɪ əˈpɪnjən/", exampleSentence: "In my opinion, this is the best solution." },
  { phrase: "It depends on", translation: "这取决于", phonetic: "/ɪt dɪˈpendz ɑːn/", exampleSentence: "It depends on how much time we have available." },
  { phrase: "By the way", translation: "顺便说一下", phonetic: "/baɪ ðə weɪ/", exampleSentence: "By the way, did you see Sarah recently?" },
  { phrase: "In other words", translation: "换句话说", phonetic: "/ɪn ˈʌðər wɜːrdz/", exampleSentence: "He didn't accept the offer. In other words, we need to find someone else." },
  { phrase: "As a result", translation: "结果", phonetic: "/æz ə rɪˈzʌlt/", exampleSentence: "As a result of the bad weather, the match was cancelled." },
  { phrase: "Take your time", translation: "慢慢来", phonetic: "/teɪk jɔːr taɪm/", exampleSentence: "Take your time, there's no rush." },
  { phrase: "I can't help it", translation: "我忍不住", phonetic: "/aɪ kænt help ɪt/", exampleSentence: "I can't help it, I find it really funny." },
  { phrase: "What's going on", translation: "发生什么事了", phonetic: "/wʌts ˈɡoʊɪŋ ɑːn/", exampleSentence: "Hey guys, what's going on here?" },
  { phrase: "I'm looking forward to", translation: "我期待", phonetic: "/aɪm ˈlʊkɪŋ ˈfɔːrwərd tuː/", exampleSentence: "I'm looking forward to seeing you next week." },
  { phrase: "Could you repeat that", translation: "你能再说一遍吗", phonetic: "/kʊd juː rɪˈpiːt ðæt/", exampleSentence: "I didn't hear you clearly, could you repeat that?" },
  { phrase: "I see what you mean", translation: "我明白你的意思", phonetic: "/aɪ siː wʌt juː miːn/", exampleSentence: "I see what you mean, that makes sense." },
  { phrase: "Speaking of which", translation: "说到这个", phonetic: "/ˈspiːkɪŋ ʌv wɪtʃ/", exampleSentence: "Speaking of which, have you finished the report?" }
];

// Level 4: Upper-intermediate
const level4Phrases = [
  { phrase: "Having said that", translation: "话虽如此", phonetic: "/ˈhævɪŋ sɛd ðæt/", exampleSentence: "The job is very difficult. Having said that, I still enjoy doing it." },
  { phrase: "By and large", translation: "大体上", phonetic: "/baɪ ænd lɑːrdʒ/", exampleSentence: "By and large, the new policy has been very successful." },
  { phrase: "At the end of the day", translation: "说到底", phonetic: "/æt ði ɛnd əv ðə deɪ/", exampleSentence: "At the end of the day, it's your decision to make." },
  { phrase: "In the long run", translation: "从长远来看", phonetic: "/ɪn ðə lɔːŋ rʌn/", exampleSentence: "Investing in education will pay off in the long run." },
  { phrase: "On a daily basis", translation: "每天", phonetic: "/ɑːn ə ˈdeɪli ˈbeɪsɪs/", exampleSentence: "We deal with hundreds of customers on a daily basis." },
  { phrase: "I couldn't agree more", translation: "我完全同意", phonetic: "/aɪ ˈkʊdnt əˈɡriː mɔːr/", exampleSentence: "I couldn't agree more with what you just said." },
  { phrase: "It's out of the question", translation: "不可能", phonetic: "/ɪts aʊt əv ðə ˈkwɛstʃən/", exampleSentence: "Accepting their terms is completely out of the question." },
  { phrase: "Break a leg", translation: "祝你好运", phonetic: "/breɪk ə lɛɡ/", exampleSentence: "Break a leg in your performance tonight!" },
  { phrase: "Costs an arm and a leg", translation: "非常昂贵", phonetic: "/kɔːsts ən ɑːrm ənd ə lɛɡ/", exampleSentence: "A new iPhone really costs an arm and a leg these days." },
  { phrase: "Hit the nail on the head", translation: "一针见血", phonetic: "/hɪt ðə neɪl ɑːn ðə hɛd/", exampleSentence: "You absolutely hit the nail on the head with that comment." },
  { phrase: "Piece of cake", translation: "小菜一碟", phonetic: "/piːs əv keɪk/", exampleSentence: "The exam was a piece of cake, I finished it in 30 minutes." },
  { phrase: "When push comes to shove", translation: "当迫不得已时", phonetic: "/wɛn pʊʃ kʌmz tuː ʃʌv/", exampleSentence: "When push comes to shove, we can always change our plan." },
  { phrase: "Bear in mind", translation: "记住", phonetic: "/bɛr ɪn maɪnd/", exampleSentence: "Bear in mind that the deadline is next Friday." },
  { phrase: "All things considered", translation: "综合考虑", phonetic: "/ɔːl θɪŋz kənˈsɪdərd/", exampleSentence: "All things considered, I think we made the right choice." },
  { phrase: "The bottom line is", translation: "底线是", phonetic: "/ðə ˈbɑːtəm laɪn ɪz/", exampleSentence: "The bottom line is that we need more money to finish the project." }
];

// Level 5: Advanced
const level5Phrases = [
  { phrase: "Be that as it may", translation: "尽管如此", phonetic: "/biː ðæt æz ɪt meɪ/", exampleSentence: "Be that as it may, we still have an obligation to complete it on time." },
  { phrase: "Last but not least", translation: "最后但同样重要", phonetic: "/læst bʌt nɑːt liːst/", exampleSentence: "And last but not least, I'd like to thank our sponsors." },
  { phrase: "For all intents and purposes", translation: "实际上", phonetic: "/fɔːr ɔːl ɪˈtentz ænd ˈpɜːrpəsəz/", exampleSentence: "For all intents and purposes, the project is now complete." },
  { phrase: "Needless to say", translation: "不用说", phonetic: "/ˈniːdləs tuː seɪ/", exampleSentence: "Needless to say, after that we never went back there again." },
  { phrase: "By virtue of", translation: "凭借", phonetic: "/baɪ ˈvɜːrtuː ʌv/", exampleSentence: "By virtue of his experience, he was given the position." },
  { phrase: "In light of", translation: "鉴于", phonetic: "/ɪn laɪt ʌv/", exampleSentence: "In light of recent events, we need to reconsider our strategy." },
  { phrase: "On the contrary", translation: "恰恰相反", phonetic: "/ɑːn ðə ˈkɑːntreri/", exampleSentence: "I don't find it difficult at all. On the contrary, I really enjoy it." },
  { phrase: "To put it in a nutshell", translation: "简而言之", phonetic: "/tuː pʊt ɪt ɪn ə ˈnʌtʃɛl/", exampleSentence: "To put it in a nutshell, the plan is not working." },
  { phrase: "The crux of the matter", translation: "问题的关键", phonetic: "/ðə krʌks əv ðə ˈmætər/", exampleSentence: "The crux of the matter is that we don't have enough funding." },
  { phrase: "Beyond the shadow of a doubt", translation: "毫无疑问", phonetic: "/bɪˈjɑːnd ðə ˈʃædoʊ əv ə daʊt/", exampleSentence: "Beyond the shadow of a doubt, he is the best candidate for the job." },
  { phrase: "A blessing in disguise", translation: "因祸得福", phonetic: "/ə ˈblɛsɪŋ ɪn dɪsˈɡaɪz/", exampleSentence: "Losing that job turned out to be a blessing in disguise." },
  { phrase: "Every cloud has a silver lining", translation: "黑暗中总有一线光明", phonetic: "/ˈɛvri klaʊd hæz ə ˈsɪlvər ˈlaɪnɪŋ/", exampleSentence: "Don't worry too much, every cloud has a silver lining." },
  { phrase: "Actions speak louder than words", translation: "行动胜于言语", phonetic: "/ˈækʃənz spiːk ˈlaʊdər ðæn wɜːrdz/", exampleSentence: "I know you say you're sorry, but actions speak louder than words." },
  { phrase: "The ball is in your court", translation: "现在该你了", phonetic: "/ðə bɔːl ɪz ɪn jɔːr kɔːrt/", exampleSentence: "I've made my offer, now the ball is in your court." },
  { phrase: "Bite off more than you can chew", translation: "贪多嚼不烂", phonetic: "/baɪt ɔːf mɔːr ðæn juː kæn tʃuː/", exampleSentence: "I think he's bitten off more than he can chew with this big project." }
];

async function main() {
  console.log('Start seeding speaking phrases...');

  // Clear existing data
  await prisma.speakingRecording.deleteMany();
  await prisma.userSpeakingPractice.deleteMany();
  await prisma.speakingPhrase.deleteMany();

  // Insert phrases by difficulty
  const allPhrases = [
    ...level1Phrases.map(p => ({ ...p, difficultyLevel: 1 })),
    ...level2Phrases.map(p => ({ ...p, difficultyLevel: 2 })),
    ...level3Phrases.map(p => ({ ...p, difficultyLevel: 3 })),
    ...level4Phrases.map(p => ({ ...p, difficultyLevel: 4 })),
    ...level5Phrases.map(p => ({ ...p, difficultyLevel: 5 })),
  ];

  console.log(`Inserting ${allPhrases.length} speaking phrases...`);

  for (const phrase of allPhrases) {
    await prisma.speakingPhrase.create({
      data: phrase,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
