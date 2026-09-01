/**
 * Fill Turkish strings that were still English copies.
 * Run: node scripts/patch-tr-translations.mjs
 */
import fs from "fs";

const path = "messages/tr.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const trMap = {
  // —— umrah (offer page + related) ——
  "umrah.listingTitle": "UMRE GRUP TURLARI",
  "umrah.listingSubtitle": "Birlikte seyahat edin. Daha iyi yaşayın.",
  "umrah.cardCityStay": "{city} ({nights})",
  "umrah.includedShort": "dahil",
  "umrah.cardGuideL1": "Rehber",
  "umrah.cardTransferL1": "Transfer",
  "umrah.cardRoomQuad": "Dört kişilik oda",
  "umrah.cardRoomTriple": "Üç kişilik oda",
  "umrah.cardRoomDouble": "Çift kişilik oda",
  "umrah.listingBenefitVisa": "Vize dahil",
  "umrah.listingBenefitFlight": "Uçuş dahil",
  "umrah.listingBenefitBaggage": "2 × 23 kg bagaj",
  "umrah.listingBenefitGuide": "Rehber dahil",
  "umrah.listingBenefitReligious": "Dini eşlik",
  "umrah.listingBenefitHotels": "Mekke & Medine otelleri",
  "umrah.listingBenefitBreakfast": "Her iki otelde kahvaltı",
  "umrah.listingBenefitTransfer": "Transferler dahil",
  "umrah.listingBenefitExcursions": "Mekke & Medine gezileri",
  "umrah.found": "{count} grup turu bulundu",
  "umrah.sortBy": "Sırala:",
  "umrah.sortNext": "En yakın tarih",
  "umrah.sortPriceAsc": "Fiyat artan",
  "umrah.sortPriceDesc": "Fiyat azalan",
  "umrah.sortSeats": "En çok yer",
  "umrah.filterAll": "Tüm tarihler",
  "umrah.filterOktober": "Ekim",
  "umrah.filterHerbstferien": "Sonbahar tatili",
  "umrah.filterNovember": "Kasım",
  "umrah.filterDezember": "Aralık",
  "umrah.filterWeihnachtsferien": "Noel tatili",
  "umrah.filterJaenner": "Ocak",
  "umrah.filterFebruar": "Şubat",
  "umrah.filterSemesterferien": "Dönem tatili",
  "umrah.filterRamadan": "Ramazan",
  "umrah.filterMaerz": "Mart",
  "umrah.filterOsterferien": "Paskalya tatili",
  "umrah.filterSectionLabel": "Seyahat dönemine göre filtrele",
  "umrah.listingSwipeHint": "← Daha fazla teklif için kaydırın →",
  "umrah.emptyFilter": "Bu seçim için şu an grup turu yok.",
  "umrah.emptyFilterForPeriod": "{period} için şu an grup turu yok.",
  "umrah.otherDates": "Diğer tarihlere bak",
  "umrah.travelDate": "Seyahat tarihleri",
  "umrah.pricePerPerson": "Kişi başı fiyatlar",
  "umrah.hotelDetailsCta": "Otel detaylarını gör",
  "umrah.amenityReception": "24 saat resepsiyon",
  "umrah.amenityNearMosque": "Kutsal Cami’ye yürüme mesafesi",
  "umrah.walkingTo": "Yaklaşık {minutes} dakika yürüme: {mosque}",
  "umrah.haram": "Mescid-i Haram",
  "umrah.nabawi": "Mescid-i Nebevi",
  "umrah.breakfast": "Kahvaltı dahil",
  "umrah.guideLanguages": "Rehber dilleri",
  "umrah.guideLanguagesValue": "Arapça · Almanca · Boşnakça · Türkçe",
  "umrah.hotelsBreakfastIncl": "Mekke & Medine otelleri kahvaltı dahil",
  "umrah.featBaggageShort": "2 × 23 kg bagaj",
  "umrah.featVisaL1": "Vize",
  "umrah.featVisaL2": "dahil",
  "umrah.featFlightL1": "Uçuş",
  "umrah.featFlightL2": "dahil",
  "umrah.featBaggageL1": "2 × 23 kg",
  "umrah.featBaggageL2": "bagaj",
  "umrah.featBaggageL3": "dahil",
  "umrah.featGuideL1": "Rehber",
  "umrah.featGuideL2": "dahil",
  "umrah.metaIncluded": "Dahil",
  "umrah.featExcursionMakkah": "Mekke gezileri",
  "umrah.featExcursionMedina": "Medine gezileri",
  "umrah.featHotelsBreakfast": "Mekke & Medine otelleri kahvaltı dahil",
  "umrah.seatsLeft": "{count} yer mevcut",
  "umrah.pricesPerPerson": "Kişi başı fiyatlar",
  "umrah.moreOfferInfo": "Teklif hakkında daha fazla bilgi",
  "umrah.hotelDetails": "Otel galerisi ve detayları",
  "umrah.hotelDetailsGallery": "Fotoğraf galerisi",
  "umrah.hotelDetailsFeatures": "Özellikler ve konum",
  "umrah.hotelCheckIn": "Giriş",
  "umrah.hotelCheckOut": "Çıkış",
  "umrah.morePhotos": "+{count} fotoğraf",
  "umrah.hotelGalleryLabel": "{hotel} fotoğrafları",
  "umrah.amenityWifi": "Ücretsiz Wi‑Fi",
  "umrah.amenityAc": "Klima",
  "umrah.amenityRestaurant": "Restoran",
  "umrah.hotelStarsAmenity": "{count} yıldız",
  "umrah.duration": "Süre",
  "umrah.tripOverview": "Seyahat özeti",
  "umrah.inquiryTripOverview": "Seyahat özeti",
  "umrah.period": "Seyahat dönemi",
  "umrah.groupSize": "Grup büyüklüğü",
  "umrah.maxPersons": "en fazla {count} kişi",
  "umrah.departureAirport": "Kalkış havaalanı",
  "umrah.airline": "Havayolu",
  "umrah.flightInfo": "{airline} ile uçuş bilgileri",
  "umrah.baggage": "Bagaj",
  "umrah.outbound": "Gidiş",
  "umrah.inbound": "Dönüş",
  "umrah.direct": "Direkt uçuş",
  "umrah.flightDuration": "Uçuş süresi: yakl. {duration}",
  "umrah.inclusions": "Dahil hizmetler",
  "umrah.incBarVisa": "Vize dahil",
  "umrah.incBarFlight": "Uçuş dahil",
  "umrah.incBarBaggage": "2 × 23 kg bagaj dahil",
  "umrah.incBarGuide": "Rehber dahil",
  "umrah.incBarReligious": "Dini eşlik dahil",
  "umrah.incBarTransfer": "Transferler dahil",
  "umrah.incBarHotels": "Medine & Mekke otelleri dahil",
  "umrah.incBarBreakfast": "Medine & Mekke’de kahvaltı dahil",
  "umrah.incBarExcursions": "Medine & Mekke gezileri dahil",
  "umrah.incBarExcursionMakkah": "Mekke gezileri dahil",
  "umrah.incBarExcursionMedina": "Medine gezileri dahil",
  "umrah.itinerary": "Seyahat programı",
  "umrah.heroSliderLabel": "Seyahat fotoğrafları",
  "umrah.heroSliderDots": "Görsel navigasyonu",
  "umrah.heroSlideKaaba": "Mekke’de Kâbe",
  "umrah.heroSlideMedina": "Medine’de Peygamber Camii’nde grup",
  "umrah.heroSlideGroup": "Mobarak grup fotoğrafı",
  "umrah.heroSlideZiyarat": "Grupla ziyaret gezisi",
  "umrah.heroSlideMakkah": "Mekke’de grup",
  "umrah.heroSlideGroup01": "Mobarak grubu gece Kâbe’de",
  "umrah.heroSlideGroup02": "Mobarak grubu Medine’de",
  "umrah.heroSlideGroup03": "Mobarak grubu ziyarette",
  "umrah.heroSlideGroup04": "Mobarak grubu Peygamber Camii avlusunda",
  "umrah.heroSlideGroup05": "Mobarak grubu gezide",
  "umrah.heroSlideGroup06": "Mobarak grubu Kâbe önünde",
  "umrah.dayLabel": "GÜN {day}",
  "umrah.sectionNavLabel": "Sayfa bölümleri",
  "umrah.sectionGallery": "Fotoğraf galerisi",
  "umrah.sectionHotels": "Medine & Mekke otelleri",
  "umrah.sectionFlights": "Uçuşlar",
  "umrah.sectionLuggage": "Bagaj",
  "umrah.sectionTransfers": "Transferler",
  "umrah.sectionVisa": "Vize",
  "umrah.sectionGuides": "Rehber ve dini eşlik",
  "umrah.sectionExcursions": "Geziler",
  "umrah.sectionItinerary": "Seyahat programı",
  "umrah.sectionPrices": "Fiyatlar",
  "umrah.sectionFaq": "Sıkça sorulan sorular",
  "umrah.detailLuggageDefault":
    "Kişi başı 2 × 23 kg bagaj dahil. Kabin bagajı havayolu kurallarına göredir.",
  "umrah.detailTransfersDefault":
    "Havalimanı ↔ otel ve Medine ↔ Mekke klimalı grup otobüsleriyle, dahil.",
  "umrah.detailVisaDefault":
    "Umre vizesi dahil — başvuruyu biz yürütür, süreçte size eşlik ederiz.",
  "umrah.detailTourGuideDefault":
    "Deneyimli rehberler grubu gün boyu eşlik eder.",
  "umrah.detailReligiousGuideDefault":
    "Yerinde dini rehberlik ve ibadet desteği.",
  "umrah.detailExcursionsDefault":
    "Mekke ve Medine’nin önemli yerlerine rehberli geziler dahil.",
  "umrah.finalCtaTitle": "Unutulmaz bir Umre yolculuğuna hazır mısınız?",
  "umrah.finalCtaBody": "Özel grup turumuzda yerinizi şimdi ayırtın.",
  "umrah.finalCtaWaitlistTitle": "Grup dolu – bekleme listesi açık",
  "umrah.finalCtaWaitlistBody":
    "Normal yerler dolu. Bekleme listesine katılın; yer açılırsa sizi bilgilendiririz.",
  "umrah.finalCtaFullTitle": "Bu grup turu şu an dolu",
  "umrah.finalCtaFullBody":
    "Grup ve bekleme listesi dolu. Yine de bağlayıcı olmayan bir talep gönderebilirsiniz — yer garantisi yoktur.",
  "umrah.inquiryWaitlistNotice":
    "Bu tur dolu. Formu göndererek bekleme listesine eklenirsiniz — şu an normal yer yok.",
  "umrah.inquiryFullNotice":
    "Grup ve bekleme listesi dolu. Talep, yer hakkı doğurmaz.",
  "umrah.inquiryTitle": "Seyahat özetiniz",
  "umrah.inquiryFormTitle": "Bilgileriniz",
  "umrah.inquiryFormSubtitle":
    "Tur, tarihler, oteller ve uçuşlar zaten seçili. Lütfen kimlerin seyahat ettiğini ve size nasıl ulaşabileceğimizi yazın.",
  "umrah.furtherDetails": "Diğer bilgiler",
  "umrah.phonePrefix": "Ülke kodu",
  "umrah.adultLabel": "Yetişkin",
  "umrah.childLabel": "Çocuk",
  "umrah.infantLabel": "Bebek",
  "umrah.inquiryTravellersInfoTitle": "Önemli:",
  "umrah.inquiryTravellersAgeNote":
    "Çocuk ve bebek yaş kategorileri dönüş tarihindeki yaşa göredir, rezervasyon tarihine değil.",
  "umrah.inquiryTravellersInfoInfant":
    "2 yaş altı bebekler: <strong>{price}</strong> uçuş bileti + vize dahil",
  "umrah.inquiryTravellersInfoChildNoBed":
    "11,99 yaş altı çocuklar (yataksız): <strong>{price}</strong>",
  "umrah.inquiryTravellersInfoChildWithBed":
    "11,99 yaş altı çocuklar (yataklı): <strong>−{price}</strong> indirim",
  "umrah.childLabelWithAge": "Çocuk {n} (dönüşte 2 – 11,99 yaş)",
  "umrah.infantLabelWithAge": "Bebek {n} (dönüşte 2 yaş altı)",
  "umrah.privacyConsent":
    "<link>Gizlilik politikasını</link> okudum ve verilerimin bu talep için işlenmesini kabul ediyorum.",
  "umrah.selectedTrip": "Seçilen tur",
  "umrah.travellers": "Yolcu sayısı",
  "umrah.adults": "Yetişkinler",
  "umrah.adultsHint": "12 yaşından itibaren",
  "umrah.children": "Çocuklar",
  "umrah.childrenHint": "dönüşte 2 – 11,99 yaş",
  "umrah.infants": "Bebekler",
  "umrah.infantsHint": "dönüşte 2 yaş altı",
  "umrah.personalData": "Tüm yolcuların kişisel bilgileri",
  "umrah.personalHint":
    "Lütfen tüm yolcu bilgilerini pasaporttaki gibi aynen girin.",
  "umrah.firstName": "Ad",
  "umrah.lastName": "Soyad",
  "umrah.nationality": "Uyruğu",
  "umrah.nationalityPlaceholder": "Uyruğu girin …",
  "umrah.passportType": "Pasaport türü",
  "umrah.childBed": "Çocuğun kendi yatağına ihtiyacı var mı?",
  "umrah.yes": "Evet",
  "umrah.no": "Hayır",
  "umrah.sourceTitle": "Bizi nasıl buldunuz?",
  "umrah.contactTitle": "İletişim bilgileri",
  "umrah.phone": "Telefon numarası",
  "umrah.phonePlaceholder": "Telefon numaranız",
  "umrah.email": "E-posta",
  "umrah.emailAddress": "E-posta adresi",
  "umrah.emailOptional": "E-posta (isteğe bağlı)",
  "umrah.emailPlaceholder": "E-posta adresiniz",
  "umrah.passportSelectPlaceholder": "Lütfen seçin",
  "umrah.passportTypeHint":
    "Normal pasaport, sözleşme pasaportu, seyahat belgesi veya diplomatik pasaport",
  "umrah.preferredLanguage": "Tercih edilen dil",
  "umrah.preferredLanguageHint":
    "Sayfa diline göre otomatik seçilir. Dili istediğiniz zaman değiştirebilirsiniz.",
  "umrah.message": "Bize mesaj (isteğe bağlı)",
  "umrah.messagePlaceholder": "Diğer istekler veya notlar...",
  "umrah.privacyNotice":
    "Verileriniz yalnızca talebinizi işlemek için kullanılır. Daha fazla bilgi <link>gizlilik politikamızda</link>.",
  "umrah.childPrices": "Çocuk ve bebek seyahati",
  "umrah.inquiryChildPrices": "Çocuk ve bebek fiyatları",
  "umrah.inquiryHotels": "Oteller",
  "umrah.infantPrice": "2 yaş altı bebekler",
  "umrah.childNoBed": "11,99 yaş altı çocuklar (yataksız)",
  "umrah.childWithBed": "11,99 yaş altı çocuklar (yataklı)",
  "umrah.inquiryExampleLabel": "Örnek:",
  "umrah.inclFlightVisa": "uçuş bileti + vize dahil",
  "umrah.childPriceNote":
    "Örnek: 2 yetişkin + 12 yaş altı 1 çocuk (yataksız) için yetişkinler çift kişilik oda fiyatını öder, üç kişilik oda fiyatını değil. Çocuk ayrıca yataksız çocuk fiyatıyla hesaplanır.",
  "umrah.childPriceNoteBody":
    "2 yetişkin + 12 yaş altı 1 çocuk (yataksız) için yetişkinler çift kişilik oda fiyatını öder, üç kişilik oda fiyatını değil. Çocuk ayrıca yataksız çocuk fiyatıyla hesaplanır.",
  "umrah.childPriceNoteShort":
    "Örnek: 2 yetişkin + 12 yaş altı 1 çocuk (yataksız) çift kişilik oda fiyatını öder, üç kişilik değil.",
  "umrah.successTitle": "Talebiniz için teşekkürler!",
  "umrah.successBody":
    "Umre talebinizi aldık ve kısa süre içinde sizinle iletişime geçeceğiz.",
  "umrah.passportNormal": "Normal pasaport",
  "umrah.passportConvention": "Sözleşme pasaportu",
  "umrah.passportTravel": "Seyahat belgesi",
  "umrah.passportDiplomatic": "Diplomatik pasaport",
  "umrah.sourceInstagram": "Instagram",
  "umrah.sourceFacebook": "Facebook",
  "umrah.sourceGoogle": "Google",
  "umrah.sourceChatgpt": "ChatGPT",
  "umrah.sourceFriend": "Bir arkadaş önerisi",
  "umrah.sourceKnow": "Sizi zaten tanıyorum",
  "umrah.sourceOther": "Diğer",
  "umrah.sourceOtherPlaceholder": "Lütfen belirtin (isteğe bağlı)",
  "umrah.validationFirstName": "Lütfen adı girin.",
  "umrah.validationLastName": "Lütfen soyadı girin.",
  "umrah.validationNationality": "Lütfen listeden bir uyruk seçin.",
  "umrah.validationPassportType": "Lütfen pasaport türünü seçin.",
  "umrah.validationChildBed": "Lütfen çocuğun yatak ihtiyacını belirtin.",
  "umrah.validationSource": "Lütfen bizi nasıl bulduğunuzu seçin.",
  "umrah.validationPhone": "Lütfen telefon numaranızı girin.",
  "umrah.validationEmail": "Lütfen geçerli bir e-posta adresi girin.",
  "umrah.paxReduceConfirm":
    "Kaldırılan yolcular için girilen bilgiler silinecek. Devam etmek istiyor musunuz?",

  // —— common ——
  "common.inquireNow": "Şimdi bağlayıcı olmadan talep et",
  "common.joinWaitlist": "Bekleme listesine katıl",
  "common.inquireNoGuarantee": "Bağlayıcı olmadan talep et",
  "common.secureSpot": "Yerinizi ayırtın",
  "common.waitlistBenefit": "Bekleme listesinde yer talep edin",
  "common.noPlaceGuarantee": "Yer garantisi yok – talep yer ayırtmaz",
  "common.freeInquiry": "Ücretsiz talep – yükümlülük yok",
  "common.comingSoon": "Bu sayfa yakında geliyor.",
  "common.comingSoonTitle": "Sayfa hazırlanıyor",
  "common.backHome": "Ana sayfaya dön",
  "common.submit": "Gönder",
  "common.required": "Zorunlu",
  "common.optional": "isteğe bağlı",
  "common.decrease": "{label} azalt",
  "common.increase": "{label} artır",

  // —— seo (offer-related + remaining EN) ——
  "seo.umrahListTitle": "Umre Grup Turları",
  "seo.umrahListDescription":
    "Güncel Umre grup kalkışlarını fiyatlar, Medine & Mekke otelleri ve müsait yerlerle karşılaştırın.",
  "seo.umrahListFilterDescription":
    "{filter} için Umre grup turları — fiyatlar, Medine & Mekke otelleri ve müsait yerler bir bakışta.",
  "seo.tripTitle": "Umre Grup Turu {date}",
  "seo.tripDescription":
    "Umre grup turu {date} – {nights} gece, Medine & Mekke otelleri, uçuş ve vize dahil. Ücretsiz talep edin.",
  "seo.individualTitle": "Bireysel Umre Seyahati",
  "seo.individualDescription":
    "Mobarak ile bireysel Umrenizi planlayın – esnek, kişisel rehberlik ve şeffaf organizasyon.",
  "seo.hajjTitle": "Mobarak ile Hac 2027",
  "seo.hajjDescription":
    "Mobarak ile Hac 2027 ön kayıt ve rehberlik – şeffaf, kişisel ve baştan sona destek.",
  "seo.aboutTitle": "Hakkımızda",
  "seo.aboutDescription":
    "Mobarak Hajj & Umrah’ı tanıyın – Avusturya’dan manevi yolculuklar için partneriniz.",
  "seo.contactTitle": "İletişim",
  "seo.contactDescription":
    "Mobarak Hajj & Umrah ile iletişime geçin – Viyana’da telefon, e-posta ve adres.",
  "seo.termsTitle": "Seyahat koşulları",
  "seo.termsDescription": "Mobarak Umre ve Hac seyahatleri için seyahat koşulları.",
  "seo.privacyTitle": "Gizlilik",
  "seo.privacyDescription": "Mobarak Hajj & Umrah gizlilik politikası.",
  "seo.agbTitle": "Şartlar",
  "seo.agbDescription": "Mobarak Hajj & Umrah genel şartlar ve koşulları.",
  "seo.imprintTitle": "Künye",
  "seo.imprintDescription": "Mobarak Hajj & Umrah yasal künyesi.",
  "seo.inquiryTitle": "Umre talebi",
  "seo.inquiryDescription": "Umre grup turunuz için bağlayıcı olmayan talep.",
};

function setPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!cur[p] || typeof cur[p] !== "object") cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

let updated = 0;
for (const [key, value] of Object.entries(trMap)) {
  setPath(data, key, value);
  updated++;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Updated ${updated} Turkish keys in ${path}`);
