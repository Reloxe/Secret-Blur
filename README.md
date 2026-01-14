# Secret Blur

**Secret Blur** is a powerful Chrome extension designed to protect your privacy during screen sharing, streaming, or recording. It automatically detects and blurs sensitive information like **Email Addresses** and **IP Addresses** (IPv4 & IPv6) on any web page.

## Features

-   **Automatic Detection**: Instantly finds and blurs emails and IP addresses.
-   **Dynamic Blur Intensity**: Smartly adjusts the blur level based on the font size of the text.
-   **Animated Visual Cue**: A subtle, pulsing border around blurred items indicates hidden content.
-   **Double-Click to Reveal**: Prevents accidental reveals.
    -   **First Click**: Turns the eye icon **red** (Warning).
    -   **Second Click**: Reveals the text.
-   **Easy Re-Blur**: A dedicated "hide" button appears next to revealed text to quickly mask it again.
-   **Performance Optimized**: Runs immediately upon page load (`document_start`) and uses a high-performance observer to catch dynamic content (SPAs, AJAX).
-   **Toggle Controls**: Enable or disable protection for Emails and IPs separately via the popup menu.
-   **Iframe & Shadow DOM Support**: Works inside iframes (e.g., Google Profile popups) and modern web components.

## Installation

1.  Clone or download this repository.
2.  Open Chrome and go to `chrome://extensions`.
3.  Enable **Developer Mode** (top right corner).
4.  Click **Load unpacked**.
5.  Select the folder containing this extension.

## Usage

1.  Click the extension icon in your browser toolbar.
2.  Use the toggle switches to enable/disable protection for **Emails** or **IP Addresses**.
3.  Browse the web as usual. Sensitive info will be blurred automatically.
4.  **To Reveal:** Double-click on any blurred item.
5.  **To Hide Again:** Click the small "hide" icon next to the revealed text.

## Privacy

This extension runs locally on your browser. No data is collected or sent to any server.

---

# Secret Blur (Türkçe)

**Secret Blur**, ekran paylaşımı, yayın açma veya video kaydı sırasında gizliliğinizi korumak için tasarlanmış güçlü bir Chrome eklentisidir. Herhangi bir web sayfasındaki **E-posta Adresleri** ve **IP Adresleri** (IPv4 & IPv6) gibi hassas bilgileri otomatik olarak algılar ve bulanıklaştırır.

## Özellikler

-   **Otomatik Algılama**: E-postaları ve IP adreslerini anında bulur ve sansürler.
-   **Akıllı Bulanıklaştırma**: Yazı boyutuna (font size) göre bulanıklık seviyesini otomatik ayarlar.
-   **Animasyonlu Görsel İpucu**: Sansürlenen öğelerin etrafında, orada gizli bir içerik olduğunu belirten hafif, nabız gibi atan bir çerçeve bulunur.
-   **Çift Tıklama ile Açma**: Yanlışlıkla açılmaları önlemek için tasarlanmıştır.
    -   **İlk Tıklama**: Göz ikonunu **kırmızıya** çevirir (Uyarı).
    -   **İkinci Tıklama**: Metni görünür hale getirir.
-   **Kolay Tekrar Gizleme**: Açılan metnin yanında beliren "gizle" butonu ile hızlıca tekrar sansürleyebilirsiniz.
-   **Performans Odaklı**: Sayfa yüklenmeye başladığı anda (`document_start`) çalışır ve dinamik içerikleri (SPA, AJAX) yakalamak için yüksek performanslı bir izleyici kullanır.
-   **Kontrol Paneli**: Açılır menüden E-postalar ve IP'ler için korumayı ayrı ayrı açıp kapatabilirsiniz.
-   **Iframe & Shadow DOM Desteği**: Iframe'ler (örn: Google Profil pencereleri) ve modern web bileşenleri içinde sorunsuz çalışır.

## Kurulum

1.  Bu projeyi indirin veya kopyalayın.
2.  Chrome tarayıcısında `chrome://extensions` adresine gidin.
3.  Sağ üst köşedeki **Geliştirici Modu**'nu aktif edin.
4.  **Paketlenmemiş öğe yükle** butonuna tıklayın.
5.  Eklenti dosyalarının olduğu klasörü seçin.

## Kullanım

1.  Tarayıcı çubuğundaki eklenti ikonuna tıklayın.
2.  **Emails** (E-postalar) veya **IP Addresses** (IP Adresleri) seçeneklerini isteğinize göre açıp kapatın.
3.  İnternette normal şekilde gezinin. Hassas bilgiler otomatik olarak bulanıklaşacaktır.
4.  **Görmek İçin:** Bulanık öğeye çift tıklayın.
5.  **Tekrar Gizlemek İçin:** Açılan metnin yanındaki küçük "gizle" ikonuna tıklayın.

## Gizlilik

Bu eklenti tamamen yerel olarak tarayıcınızda çalışır. Hiçbir veri toplanmaz veya herhangi bir sunucuya gönderilmez.

---
Developed by [Nokersoft](https://www.nokersoft.com)
