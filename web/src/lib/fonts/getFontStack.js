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
  };
  return fontMap[fontName] || defaultFont;
}
