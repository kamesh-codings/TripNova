// Real-time Multi-Language Translation Utility with Offline Fallback Dictionary

export interface TranslationDictionary {
  [englishPhrase: string]: Record<string, string>;
}

export const OFFLINE_TRAVEL_DICTIONARY: TranslationDictionary = {
  // Medical & Emergency
  'Where is the nearest medical pharmacy?': {
    Tamil: 'அருகிலுள்ள மருத்துவ மருந்தகம் எங்கே உள்ளது?',
    Hindi: 'निकटतम मेडिकल फार्मेसी कहाँ है?',
    Telugu: 'సమీపంలోని మెడికల్ ఫార్మసీ ఎక్కడ ఉంది?',
    Malayalam: 'ഏറ്റവും അടുത്തുള്ള മെഡിക്കൽ ഫാർമസി എവിടെയാണ്?',
    Kannada: 'ಹತ್ತಿರದ ವೈದ್ಯಕೀಯ ಔಷಧಾಲಯ ಎಲ್ಲಿದೆ?',
    Bengali: 'নিকটতম মেডিকেল ফার্মেসি কোথায়?',
    Marathi: 'जवळचे मेडिकल फार्मसी कुठे आहे?',
    Gujarati: 'નજીકની મેડિકલ ફાર્મસી ક્યાં છે?',
    Punjabi: 'ਸਭ ਤੋਂ ਨਜ਼ਦੀਕੀ ਮੈਡੀਕਲ ਫਾਰਮੇਸੀ ਕਿੱਥੇ ਹੈ?',
    Urdu: 'قریب ترین میڈیکل فارمیسی کہاں ہے؟',
    French: 'Où se trouve la pharmacie la plus proche ?',
    Spanish: '¿Dónde está la farmacia más cercana?',
    German: 'Wo ist die nächste Apotheke?',
    Japanese: '一番近い薬局はどこですか？',
    Italian: 'Dov\'è la farmacia più vicina?',
    Arabic: 'أين أقرب صيدلية؟',
    'Chinese (Mandarin)': '最近的药店在哪里？',
    Russian: 'Где находится ближайшая аптека?',
    Portuguese: 'Onde fica a farmácia mais próxima?',
    Korean: '가장 가까운 약국이 어디에 있나요?',
    Turkish: 'En yakın eczane nerede?',
    Thai: 'ร้านขายยาที่ใกล้ที่สุดอยู่ที่ไหน?',
    Vietnamese: 'Hiệu thuốc gần nhất ở đâu?',
    Indonesian: 'Di mana apotek terdekat?',
    Dutch: 'Waar is de dichtstbijzijnde apotheek?'
  },
  'I need immediate doctor help': {
    Tamil: 'எனக்கு உடனடியாக மருத்துவர் உதவி தேவை',
    Hindi: 'मुझे तुरंत डॉक्टर की मदद चाहिए',
    Telugu: 'నాకు వెంటనే డాక్టర్ సహాయం కావాలి',
    Malayalam: 'എനിക്ക് ഉടനടി ഡോക്ടറുടെ സഹായം വേണം',
    Kannada: 'ನನಗೆ ತಕ್ಷಣ ವೈದ್ಯರ ಸಹಾಯ ಬೇಕು',
    Bengali: 'আমার অবিলম্বে ডাক্তারের সাহায্য প্রয়োজন',
    Marathi: 'मला त्वरित डॉक्टरांची मदत हवी आहे',
    Gujarati: 'મને તાત્કાલિક ડૉક્ટરની મદદની જરૂર છે',
    Punjabi: 'ਮੈਨੂੰ ਤੁਰੰਤ ਡਾਕਟਰ ਦੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ',
    Urdu: 'مجھے فوری ڈاکٹر کی مدد درکار ہے',
    French: 'J\'ai besoin d\'un médecin immédiatement',
    Spanish: 'Necesito ayuda médica de inmediato',
    German: 'Ich brauche sofort einen Arzt',
    Japanese: 'すぐに医師の診察が必要です',
    Italian: 'Ho bisogno subito di un medico',
    Arabic: 'أحتاج إلى مساعدة طبية فورية',
    'Chinese (Mandarin)': '我需要立即看医生',
    Russian: 'Мне срочно нужна помощь врача',
    Portuguese: 'Preciso de ajuda médica imediatamente',
    Korean: '즉시 의사의 도움이 필요합니다',
    Turkish: 'Acil doktora ihtiyacım var',
    Thai: 'ฉันต้องการความช่วยเหลือจากแพทย์ทันที',
    Vietnamese: 'Tôi cần bác sĩ giúp đỡ ngay lập tức',
    Indonesian: 'Saya butuh bantuan dokter segera',
    Dutch: 'Ik heb onmiddellijk hulp van een dokter nodig'
  },
  'Please call an ambulance': {
    Tamil: 'தயவுசெய்து ஆம்புலன்ஸை அழைக்கவும்',
    Hindi: 'कृपया एम्बुलेंस बुलाएं',
    Telugu: 'దయచేసి అంబులెన్స్‌ను పిలవండి',
    Malayalam: 'ദയവായി ആംബുലൻസ് വിളിക്കുക',
    Kannada: 'ದಯವಿಟ್ಟು ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆಯಿರಿ',
    Bengali: 'দয়া করে একটি অ্যাম্বুলেন্স ডাকুন',
    Marathi: 'कृपया रुग्णवाहिका बोलवा',
    Gujarati: 'કૃપા કરીને એમ્બ્યુલન્સ બોલાવો',
    Punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ',
    Urdu: 'براہ کرم ایمبولینس کو کال کریں',
    French: 'Veuillez appeler une ambulance',
    Spanish: 'Por favor, llame a una ambulancia',
    German: 'Bitte rufen Sie einen Krankenwagen',
    Japanese: '救急車を呼んでください',
    Italian: 'Per favore, chiamate un\'ambulanza',
    Arabic: 'يرجى الاتصال بالإسعاف',
    'Chinese (Mandarin)': '请叫救护车',
    Russian: 'Пожалуйста, вызовите скорую помощь',
    Portuguese: 'Por favor, chame uma ambulância',
    Korean: '구급차를 불러주세요',
    Turkish: 'Lütfen ambulans çağırın',
    Thai: 'กรุณาเรียกรถพยาบาล',
    Vietnamese: 'Làm ơn gọi xe cấp cứu',
    Indonesian: 'Tolong panggil ambulans',
    Dutch: 'Bel alstublieft een ambulance'
  },
  'I have an emergency': {
    Tamil: 'எனக்கு ஒரு அவசர நிலை ஏற்பட்டுள்ளது',
    Hindi: 'मुझे एक आपातकालीन स्थिति है',
    Telugu: 'నాకు ఒక అత్యవసర పరిస్థితి ఉంది',
    Malayalam: 'എനിക്ക് ഒരു അടിയന്തരാവസ്ഥയുണ്ട്',
    Kannada: 'ನನಗೆ ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಇದೆ',
    Bengali: 'আমার একটি জরুরি অবস্থা আছে',
    Marathi: 'माझी आणीबाणीची परिस्थिती आहे',
    Gujarati: 'મારી કટોકટીની પરિસ્થિતિ છે',
    Punjabi: 'ਮੇਰੇ ਕੋਲ ਐਮਰਜੈਂਸੀ ਹੈ',
    Urdu: 'میری ہنگامی صورتحال ہے',
    French: 'J\'ai une urgence',
    Spanish: 'Tengo una emergencia',
    German: 'Ich habe einen Notfall',
    Japanese: '緊急事態です',
    Italian: 'Ho un\'emergenza',
    Arabic: 'لدي حالة طوارئ',
    'Chinese (Mandarin)': '我有紧急情况',
    Russian: 'У меня чрезвычайная ситуация',
    Portuguese: 'Tenho uma emergência',
    Korean: '비상 상황입니다',
    Turkish: 'Acil bir durumum var',
    Thai: 'ฉันมีเหตุฉุกเฉิน',
    Vietnamese: 'Tôi đang có trường hợp khẩn cấp',
    Indonesian: 'Saya mengalami keadaan darurat',
    Dutch: 'Ik heb een noodgeval'
  },
  // Transport & Commute
  'Please turn on the meter': {
    Tamil: 'தயவுசெய்து மீட்டர் போடுங்கள்',
    Hindi: 'कृपया मीटर चालू करें',
    Telugu: 'దయచేసి మీటర్ వేయండి',
    Malayalam: 'ദയവായി മീറ്റർ ഇടുക',
    Kannada: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ',
    Bengali: 'দয়া করে মিটার চালু করুন',
    Marathi: 'कृपया मीटर चालू करा',
    Gujarati: 'કૃપા કરીને મીટર ચાલુ કરો',
    Punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਮੀਟਰ ਚਾਲੂ ਕਰੋ',
    Urdu: 'براہ کرم میٹر آن کریں',
    French: 'Veuillez allumer le compteur s\'il vous plaît',
    Spanish: 'Por favor, encienda el taxímetro',
    German: 'Bitte schalten Sie das Taxameter ein',
    Japanese: 'メーターを入れてください',
    Italian: 'Per favore accenda il tassametro',
    Arabic: 'يرجى تشغيل العداد',
    'Chinese (Mandarin)': '请打表',
    Russian: 'Пожалуйста, включите счетчик',
    Portuguese: 'Por favor, ligue o taxímetro',
    Korean: '미터기를 켜주세요',
    Turkish: 'Lütfen taksimetreyi açın',
    Thai: 'กรุณาเปิดมิเตอร์',
    Vietnamese: 'Làm ơn bật đồng hồ tính tiền',
    Indonesian: 'Tolong nyalakan argometer',
    Dutch: 'Zet alstublieft de meter aan'
  },
  'How much is the ticket?': {
    Tamil: 'டிக்கெட் விலை என்ன?',
    Hindi: 'टिकट कितने का है?',
    Telugu: 'టికెట్ ఎంత?',
    Malayalam: 'ടിക്കറ്റിന് എത്ര രൂപയാണ്?',
    Kannada: 'ಟಿಕೆಟ್ ಬೆಲೆ ಎಷ್ಟು?',
    Bengali: 'টিকিটের দাম কত?',
    Marathi: 'तिकीट कितीचे आहे?',
    Gujarati: 'ટિકિટની કિંમત કેટલી છે?',
    Punjabi: 'ਟਿਕਟ ਕਿੰਨੇ ਦੀ ਹੈ?',
    Urdu: 'ٹکٹ کتنے کا ہے؟',
    French: 'Combien coûte le billet ?',
    Spanish: '¿Cuánto cuesta el billete?',
    German: 'Wie viel kostet die Fahrkarte?',
    Japanese: 'チケットはいくらですか？',
    Italian: 'Quanto costa il biglietto?',
    Arabic: 'كم سعر التذكرة؟',
    'Chinese (Mandarin)': '票价多少钱？',
    Russian: 'Сколько стоит билет?',
    Portuguese: 'Quanto custa a passagem?',
    Korean: '티켓이 얼마인가요?',
    Turkish: 'Bilet ne kadar?',
    Thai: 'ตั๋วราคาเท่าไหร่?',
    Vietnamese: 'Vé này giá bao nhiêu?',
    Indonesian: 'Berapa harga tiketnya?',
    Dutch: 'Hoeveel kost het kaartje?'
  },
  'Take me to this address please': {
    Tamil: 'தயவுசெய்து என்னை இந்த முகவரிக்கு அழைத்துச் செல்லுங்கள்',
    Hindi: 'कृपया मुझे इस पते पर ले चलें',
    Telugu: 'దయచేసి నన్ను ఈ చిరునామాకు తీసుకెళ్లండి',
    Malayalam: 'ദയവായി എന്നെ ഈ വിലാസത്തിലേക്ക് കൊണ്ടുപോകുക',
    Kannada: 'ದಯವಿಟ್ಟು ನನ್ನನ್ನು ಈ ವಿಳಾಸಕ್ಕೆ ಕರೆದೊಯ್ಯಿರಿ',
    Bengali: 'দয়া করে আমাকে এই ঠিকানায় নিয়ে যান',
    Marathi: 'कृपया मला या पत्त्यावर घेऊन जा',
    Gujarati: 'કૃપા કરીને મને આ સરનામે લઈ જાઓ',
    Punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇਸ ਪਤੇ \'ਤੇ ਲੈ ਜਾਓ',
    Urdu: 'براہ کرم مجھے اس پتے پر لے جائیں',
    French: 'Emmenez-moi à cette adresse s\'il vous plaît',
    Spanish: 'Lléveme a esta dirección por favor',
    German: 'Bringen Sie mich bitte zu dieser Adresse',
    Japanese: 'この住所まで連れて行ってください',
    Italian: 'Mi porti a questo indirizzo per favore',
    Arabic: 'خذني إلى هذا العنوان من فضلك',
    'Chinese (Mandarin)': '请带我去这个地址',
    Russian: 'Отвезите меня по этому адресу, пожалуйста',
    Portuguese: 'Leve-me a este endereço, por favor',
    Korean: '이 주소로 가주세요',
    Turkish: 'Lütfen beni bu adrese götürün',
    Thai: 'กรุณาพาฉันไปที่อยู่นี้',
    Vietnamese: 'Làm ơn đưa tôi đến địa chỉ này',
    Indonesian: 'Tolong bawa saya ke alamat ini',
    Dutch: 'Breng me alstublieft naar dit adres'
  },
  'Where is the bus stop?': {
    Tamil: 'பேருந்து நிறுத்தம் எங்கே?',
    Hindi: 'बस स्टॉप कहाँ है?',
    Telugu: 'బస్సు స్టాప్ ఎక్కడ ఉంది?',
    Malayalam: 'ബസ് സ്റ്റോപ്പ് എവിടെയാണ്?',
    Kannada: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
    Bengali: 'বাস স্টপ কোথায়?',
    Marathi: 'बस थांबा कुठे आहे?',
    Gujarati: 'બસ સ્ટોપ ક્યાં છે?',
    Punjabi: 'ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ?',
    Urdu: 'بس اسٹاپ کہاں ہے؟',
    French: 'Où est l\'arrêt de bus ?',
    Spanish: '¿Dónde está la parada de autobús?',
    German: 'Wo ist die Bushaltestelle?',
    Japanese: 'バス停はどこですか？',
    Italian: 'Dov\'è la fermata dell\'autobus?',
    Arabic: 'أين محطة الحافلات؟',
    'Chinese (Mandarin)': '公交车站在哪里？',
    Russian: 'Где находится автобусная остановка?',
    Portuguese: 'Onde fica o ponto de ônibus?',
    Korean: '버스 정류장이 어디에 있나요?',
    Turkish: 'Otobüs durağı nerede?',
    Thai: 'ป้ายรถเมล์อยู่ที่ไหน?',
    Vietnamese: 'Trạm xe buýt ở đâu?',
    Indonesian: 'Di mana halte bus?',
    Dutch: 'Waar is de bushalte?'
  },
  'Where is the train station?': {
    Tamil: 'ரயில் நிலையம் எங்கே?',
    Hindi: 'रेलवे स्टेशन कहाँ है?',
    Telugu: 'రైల్వే స్టేషన్ ఎక్కడ ఉంది?',
    Malayalam: 'റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?',
    Kannada: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
    Bengali: 'রেলওয়ে স্টেশন কোথায়?',
    Marathi: 'रेल्वे स्टेशन कुठे आहे?',
    Gujarati: 'રેલવે સ્ટેશન ક્યાં છે?',
    Punjabi: 'ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ?',
    Urdu: 'ریلوے اسٹیشن کہاں ہے؟',
    French: 'Où est la gare ?',
    Spanish: '¿Dónde está la estación de tren?',
    German: 'Wo ist der Bahnhof?',
    Japanese: '駅はどこですか？',
    Italian: 'Dov\'è la stazione ferroviaria?',
    Arabic: 'أين محطة القطار؟',
    'Chinese (Mandarin)': '火车站在哪里？',
    Russian: 'Где находится железнодорожный вокзал?',
    Portuguese: 'Onde fica a estação de trem?',
    Korean: '기차역이 어디에 있나요?',
    Turkish: 'Tren istasyonu nerede?',
    Thai: 'สถานีรถไฟอยู่ที่ไหน?',
    Vietnamese: 'Ga xe lửa ở đâu?',
    Indonesian: 'Di mana stasiun kereta?',
    Dutch: 'Waar is het treinstation?'
  },
  // Food & Dining
  'I need vegetarian food': {
    Tamil: 'எனக்கு சைவ உணவு வேண்டும்',
    Hindi: 'मुझे शाकाहारी भोजन चाहिए',
    Telugu: 'నాకు శాఖాహార భోజనం కావాలి',
    Malayalam: 'എനിക്ക് സസ്യഭക്ഷണം വേണം',
    Kannada: 'ನನಗೆ ಸಸ್ಯಾಹಾರಿ ಊಟ ಬೇಕು',
    Bengali: 'আমার নিরামিষ খাবার দরকার',
    Marathi: 'मला शाकाहारी जेवण हवे आहे',
    Gujarati: 'મને શાકાહારી ભોજન જોઈએ છે',
    Punjabi: 'ਮੈਨੂੰ ਸ਼ਾਕਾਹਾਰੀ ਭੋਜਨ ਚਾਹੀਦਾ ਹੈ',
    Urdu: 'مجھے سبزی خور کھانا چاہیے',
    French: 'Je voudrais de la nourriture végétarienne',
    Spanish: 'Necesito comida vegetariana',
    German: 'Ich möchte vegetarisches Essen',
    Japanese: 'ベジタリアン料理が必要です',
    Italian: 'Vorrei cibo vegetariano',
    Arabic: 'أريد طعاماً نباتياً',
    'Chinese (Mandarin)': '我需要素食',
    Russian: 'Мне нужна вегетарианская еда',
    Portuguese: 'Eu preciso de comida vegetariana',
    Korean: '채식 음식이 필요합니다',
    Turkish: 'Vejetaryen yemeğe ihtiyacım var',
    Thai: 'ฉันต้องการอาหารมังสวิรัติ',
    Vietnamese: 'Tôi cần thức ăn chay',
    Indonesian: 'Saya butuh makanan vegetarian',
    Dutch: 'Ik heb vegetarisch eten nodig'
  },
  'Is drinking water safe here?': {
    Tamil: 'இங்கு குடிநீர் பாதுகாப்பானதா?',
    Hindi: 'क्या यहाँ पीने का पानी सुरक्षित है?',
    Telugu: 'ఇక్కడ తాగునీరు సురక్షితమేనా?',
    Malayalam: 'ഇവിടെ കുടിവെള്ളം സുരക്ഷിതമാണോ?',
    Kannada: 'ಇಲ್ಲಿ ಕುಡಿಯುವ ನೀರು ಸುರಕ್ಷಿತವೇ?',
    Bengali: 'এখানে পানীয় জল কি নিরাপদ?',
    Marathi: 'येथील पिण्याचे पाणी सुरक्षित आहे का?',
    Gujarati: 'શું અહીં પીવાનું પાણી સુરક્ષિત છે?',
    Punjabi: 'ਕੀ ਇੱਥੇ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਸੁਰੱਖਿਅਤ ਹੈ?',
    Urdu: 'کیا یہاں پینے کا پانی محفوظ ہے؟',
    French: 'L\'eau potable est-elle sûre ici ?',
    Spanish: '¿El agua potable es segura aquí?',
    German: 'Ist das Trinkwasser hier sicher?',
    Japanese: 'ここの飲料水は安全ですか？',
    Italian: 'L\'acqua potabile è sicura qui?',
    Arabic: 'هل مياه الشرب آمنة هنا؟',
    'Chinese (Mandarin)': '这里的饮用水安全吗？',
    Russian: 'Безопасно ли пить эту воду?',
    Portuguese: 'A água potável é segura aqui?',
    Korean: '여기 식수는 안전한가요?',
    Turkish: 'Buradaki içme suyu güvenli mi?',
    Thai: 'น้ำดื่มที่นี่ปลอดภัยไหม?',
    Vietnamese: 'Nước uống ở đây có an toàn không?',
    Indonesian: 'Apakah air minum di sini aman?',
    Dutch: 'Is het drinkwater hier veilig?'
  },
  'Please give me bottled water': {
    Tamil: 'தயவுசெய்து எனக்கு பாட்டில் தண்ணீர் கொடுங்கள்',
    Hindi: 'कृपया मुझे बोतलबंद पानी दें',
    Telugu: 'దయచేసి నాకు బాటిల్ వాటర్ ఇవ్వండి',
    Malayalam: 'ദയവായി എനിക്ക് ബോട്ടിൽ ചെയ്ത വെള്ളം തരൂ',
    Kannada: 'ದಯವಿಟ್ಟು ನನಗೆ ಬಾಟಲ್ ನೀರು ಕೊಡಿ',
    Bengali: 'দয়া করে আমাকে বোতলজাত পানি দিন',
    Marathi: 'कृपया मला बाटलीबंद पाणी द्या',
    Gujarati: 'કૃપા કરીને મને બોટલનું પાણી આપો',
    Punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਬੋਤਲਬੰਦ ਪਾਣੀ ਦਿਓ',
    Urdu: 'براہ کرم مجھے بوتل کا پانی دیں',
    French: 'Donnez-moi une bouteille d\'eau s\'il vous plaît',
    Spanish: 'Por favor deme agua embotellada',
    German: 'Bitte geben Sie mir Flaschenwasser',
    Japanese: 'ボトルの水をください',
    Italian: 'Per favore mi dia acqua in bottiglia',
    Arabic: 'أعطني ماء معبأ من فضلك',
    'Chinese (Mandarin)': '请给我瓶装水',
    Russian: 'Дайте мне, пожалуйста, бутилированную воду',
    Portuguese: 'Por favor, dê-me água engarrafada',
    Korean: '생수 한 병 주세요',
    Turkish: 'Lütfen bana şişe su verin',
    Thai: 'กรุณาขอน้ำดื่มบรรจุขวด',
    Vietnamese: 'Làm ơn cho tôi nước đóng chai',
    Indonesian: 'Tolong beri saya air kemasan',
    Dutch: 'Geef me alstublieft een fles water'
  },
  // General & Greetings
  'Hello, how are you?': {
    Tamil: 'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?',
    Hindi: 'नमस्ते, आप कैसे हैं?',
    Telugu: 'నమస్కారం, మీరు ఎలా ఉన్నారు?',
    Malayalam: 'നമസ്കാരം, സുഖമാണോ?',
    Kannada: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
    Bengali: 'হ্যালো, আপনি কেমন আছেন?',
    Marathi: 'नमस्कार, तुम्ही कसे आहात?',
    Gujarati: 'નમસ્તે, તમે કેમ છો?',
    Punjabi: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
    Urdu: 'ہیلو، آپ کیسے ہیں؟',
    French: 'Bonjour, comment allez-vous ?',
    Spanish: 'Hola, ¿cómo estás?',
    German: 'Hallo, wie geht es dir?',
    Japanese: 'こんにちは、お元気ですか？',
    Italian: 'Ciao, come stai?',
    Arabic: 'مرحبا، كيف حالك؟',
    'Chinese (Mandarin)': '你好，你好吗？',
    Russian: 'Здравствуйте, как ваши дела?',
    Portuguese: 'Olá, como vai?',
    Korean: '안녕하세요, 어떻게 지내세요?',
    Turkish: 'Merhaba, nasılsınız?',
    Thai: 'สวัสดี คุณเป็นอย่างไรบ้าง?',
    Vietnamese: 'Xin chào, bạn khỏe không?',
    Indonesian: 'Halo, apa kabar?',
    Dutch: 'Hallo, hoe gaat het?'
  },
  'Thank you very much': {
    Tamil: 'மிக்க நன்றி',
    Hindi: 'बहुत बहुत धन्यवाद',
    Telugu: 'చాలా ధన్యవాదాలు',
    Malayalam: 'വളരെ നന്ദി',
    Kannada: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು',
    Bengali: 'অনেক ধন্যবাদ',
    Marathi: 'खूप खूप धन्यवाद',
    Gujarati: 'ખૂબ ખૂબ આભાર',
    Punjabi: 'ਬਹੁਤ ਬਹੁਤ ਧੰਨਵਾਦ',
    Urdu: 'بہت بہت شکریہ',
    French: 'Merci beaucoup',
    Spanish: 'Muchas gracias',
    German: 'Vielen Dank',
    Japanese: 'どうもありがとうございます',
    Italian: 'Grazie mille',
    Arabic: 'شكرا جزيلا لك',
    'Chinese (Mandarin)': '非常感谢',
    Russian: 'Большое спасибо',
    Portuguese: 'Muito obrigado',
    Korean: '대단히 감사합니다',
    Turkish: 'Çok teşekkür ederim',
    Thai: 'ขอบคุณมากครับ/ค่ะ',
    Vietnamese: 'Cảm ơn bạn rất nhiều',
    Indonesian: 'Terima kasih banyak',
    Dutch: 'Hartelijk dank'
  },
  'Can you help me please?': {
    Tamil: 'எனக்கு கொஞ்சம் உதவ முடியுமா?',
    Hindi: 'क्या आप मेरी मदद कर सकते हैं?',
    Telugu: 'దయచేసి నాకు సహాయం చేయగలరా?',
    Malayalam: 'ദയവായി എന്നെ സഹായിക്കാമോ?',
    Kannada: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡುವಿರಾ?',
    Bengali: 'দয়া করে আপনি কি আমাকে সাহায্য করতে পারেন?',
    Marathi: 'कृपया तुम्ही मला मदत करू शकता का?',
    Gujarati: 'શું તમે મને મદદ કરી શકો છો?',
    Punjabi: 'ਕੀ ਤੁਸੀਂ ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?',
    Urdu: 'کیا آپ میری مدد کر سکتے ہیں؟',
    French: 'Pouvez-vous m\'aider s\'il vous plaît ?',
    Spanish: '¿Puede ayudarme por favor?',
    German: 'Können Sie mir bitte helfen?',
    Japanese: '助けていただけますか？',
    Italian: 'Può aiutarmi per favore?',
    Arabic: 'هل يمكنك مساعدتي من فضلك؟',
    'Chinese (Mandarin)': '你能帮帮我吗？',
    Russian: 'Не могли бы вы мне помочь?',
    Portuguese: 'Pode ajudar-me, por favor?',
    Korean: '도와주실 수 있나요?',
    Turkish: 'Lütfen bana yardım edebilir misiniz?',
    Thai: 'คุณช่วยฉันหน่อยได้ไหม?',
    Vietnamese: 'Bạn có thể giúp tôi được không?',
    Indonesian: 'Bisakah Anda membantu saya?',
    Dutch: 'Kunt u mij alstublieft helpen?'
  },
  'Do you speak English?': {
    Tamil: 'நீங்கள் ஆங்கிலம் பேசுவீர்களா?',
    Hindi: 'क्या आप अंग्रेजी बोलते हैं?',
    Telugu: 'మీరు ఇంగ్లీష్ మాట్లాడతారా?',
    Malayalam: 'നിങ്ങൾ ഇംഗ്ലീഷ് സംസാരിക്കുമോ?',
    Kannada: 'ನೀವು ಇಂಗ್ಲಿಷ್ ಮಾತನಾಡುತ್ತೀರಾ?',
    Bengali: 'আপনি কি ইংরেজি বলতে পারেন?',
    Marathi: 'तुम्ही इंग्रजी बोलता का?',
    Gujarati: 'શું તમે અંગ્રેજી બોલો છો?',
    Punjabi: 'ਕੀ ਤੁਸੀਂ ਅੰਗਰੇਜ਼ੀ ਬੋਲਦੇ ਹੋ?',
    Urdu: 'کیا آپ انگریزی بولتے ہیں؟',
    French: 'Parlez-vous anglais ?',
    Spanish: '¿Habla inglés?',
    German: 'Sprechen Sie Englisch?',
    Japanese: '英語を話せますか？',
    Italian: 'Parla inglese?',
    Arabic: 'هل تتحدث الإنجليزية؟',
    'Chinese (Mandarin)': '你会说英语吗？',
    Russian: 'Вы говорите по-английски?',
    Portuguese: 'Você fala inglês?',
    Korean: '영어 할 줄 아세요?',
    Turkish: 'İngilizce biliyor musunuz?',
    Thai: 'คุณพูดภาษาอังกฤษได้ไหม?',
    Vietnamese: 'Bạn có nói tiếng Anh không?',
    Indonesian: 'Apakah Anda bisa berbahasa Inggris?',
    Dutch: 'Spreekt u Engels?'
  }
};

const LANG_CODE_PAIR_MAP: Record<string, string> = {
  // Indian
  Tamil: 'ta',
  Hindi: 'hi',
  Telugu: 'te',
  Malayalam: 'ml',
  Kannada: 'kn',
  Bengali: 'bn',
  Marathi: 'mr',
  Gujarati: 'gu',
  Punjabi: 'pa',
  Urdu: 'ur',

  // Global
  English: 'en',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Japanese: 'ja',
  Italian: 'it',
  Arabic: 'ar',
  'Chinese (Mandarin)': 'zh-CN',
  Russian: 'ru',
  Portuguese: 'pt',
  Korean: 'ko',
  Turkish: 'tr',
  Thai: 'th',
  Vietnamese: 'vi',
  Indonesian: 'id',
  Dutch: 'nl'
};

/**
 * Translates text between languages using an offline high-accuracy dictionary first,
 * and falling back to the free MyMemory translation API.
 */
export async function translateText(
  text: string,
  fromLang: string = 'English',
  toLang: string = 'Tamil'
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (fromLang === toLang) return trimmed;

  // 1. Check direct match in offline dictionary
  for (const [enKey, translations] of Object.entries(OFFLINE_TRAVEL_DICTIONARY)) {
    // English -> Target
    if (fromLang === 'English' && enKey.toLowerCase() === trimmed.toLowerCase()) {
      const match = translations[toLang];
      if (match) return match;
    }

    // Source -> Target
    const sourceMatch = translations[fromLang];
    if (sourceMatch && sourceMatch.toLowerCase() === trimmed.toLowerCase()) {
      if (toLang === 'English') return enKey;
      const targetMatch = translations[toLang];
      if (targetMatch) return targetMatch;
    }
  }

  // 2. Try online translation with MyMemory API
  const fromCode = LANG_CODE_PAIR_MAP[fromLang] || 'en';
  const toCode = LANG_CODE_PAIR_MAP[toLang] || 'ta';

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${fromCode}|${toCode}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data?.responseData?.translatedText) {
        // Clean any HTML entities in result
        const clean = data.responseData.translatedText
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');

        // Check if MyMemory returned an error message in translatedText
        if (!clean.toUpperCase().startsWith('MYMEMORY WARNING') && !clean.toUpperCase().startsWith('PLEASE SELECT')) {
          return clean;
        }
      }
    }
  } catch (err) {
    console.warn('Online translation network request failed or timed out:', err);
  }

  // 3. Fallback heuristic
  return `${trimmed} (${toLang})`;
}
