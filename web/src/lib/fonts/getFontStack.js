/**
 * Font stack generation utility
 * Maps font names to their CSS font-family declarations with fallbacks
 */
export function getFontStack(fontName, defaultFont) {
  const fontMap = {
    // ROCK/METAL FONTS
    MetalMania: "'MetalMania', cursive",
    Butcherman: "'Butcherman', cursive",
    RoadRage: "'RoadRage', cursive",
    RubikBurned: "'RubikBurned', cursive",
    RubikGlitch: "'RubikGlitch', cursive",
    RubikWetPaint: "'RubikWetPaint', cursive",
    Bungee: "'Bungee', cursive",
    BungeeHairline: "'BungeeHairline', cursive",
    Bangers: "'Bangers', cursive",
    Barrio: "'Barrio', cursive",
    Frijole: "'Frijole', cursive",
    Griffy: "'Griffy', cursive",
    JollyLodger: "'JollyLodger', cursive",
    Lacquer: "'Lacquer', cursive",
    PirataOne: "'PirataOne', cursive",
    // RETRO/VINTAGE FONTS
    Asimovian: "'Asimovian', monospace",
    SixCaps: "'SixCaps', sans-serif",
    Smokum: "'Smokum', cursive",
    Rye: "'Rye', cursive",
    TradeWinds: "'TradeWinds', cursive",
    IMFellEnglishSC: "'IMFellEnglishSC', serif",
    // DRAMATIC/ARTISTIC FONTS
    Ewert: "'Ewert', cursive",
    FrederickatheGreat: "'FrederickatheGreat', cursive",
    GlassAntiqua: "'GlassAntiqua', serif",
    Lancelot: "'Lancelot', cursive",
    Macondo: "'Macondo', cursive",
    // HAND-DRAWN/CASUAL FONTS
    LondrinaSketch: "'LondrinaSketch', cursive",
    Caveat: "'Caveat', cursive",
    SmoochSans: "'SmoochSans', cursive",
    AmaticSC: "'AmaticSC', cursive",
    Chicle: "'Chicle', cursive",
    // FUN/PLAYFUL FONTS
    Aladin: "'Aladin', cursive",
    Bahiana: "'Bahiana', cursive",
    CaesarDressing: "'CaesarDressing', cursive",
    Danfo: "'Danfo', cursive",
    Fascinate: "'Fascinate', cursive",
    Iceland: "'Iceland', cursive",
    // EXISTING FONTS
    Anton: "'Anton', sans-serif",
    BebasNeue: "'Bebas Neue', sans-serif",
    Creepster: "'Creepster', cursive",
    IndieFlower: "'Indie Flower', cursive",
    Kalam: "'Kalam', cursive",
    Lobster: "'Lobster', cursive",
    Pacifico: "'Pacifico', cursive",
    Righteous: "'Righteous', cursive",
    Sancreek: "'Sancreek', cursive",
    sprayPaint: "'sprayPaint', cursive",
    VT323: "'VT323', monospace",
    // SECONDARY FONTS
    CourierPrime: "'CourierPrime', monospace",
    SpecialElite: "'SpecialElite', monospace",
    XanhMono: "'XanhMono', monospace",
    Oranienbaum: "'Oranienbaum', serif",
    CormorantUnicase: "'CormorantUnicase', serif",
    Bellefair: "'Bellefair', serif",
    Italiana: "'Italiana', serif",
    ArchitectsDaughter: "'Architects Daughter', cursive",
    Oswald: "'Oswald', sans-serif",
    EpundaSlab: "'EpundaSlab', serif",
    InstrumentSerif: "'InstrumentSerif', serif",
    'Courier New': "'Courier New', Courier, monospace",
    // SYSTEM FONTS
    MyanmarMN: "'Myanmar MN', 'Myanmar Text', 'Padauk', sans-serif",
    Arial: "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
    Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    'Times New Roman': "'Times New Roman', Times, serif",
    Georgia: "'Georgia', 'Times New Roman', Times, serif",
    Verdana: "'Verdana', Geneva, sans-serif",
    'Trebuchet MS':
      "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
    Impact: "'Impact', 'Arial Black', sans-serif",
    'Comic Sans MS': "'Comic Sans MS', cursive, sans-serif",
    Palatino: "'Palatino', 'Palatino Linotype', 'Book Antiqua', Georgia, serif",
  };
  return fontMap[fontName] || defaultFont;
}
