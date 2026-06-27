import type { Category, Product } from '@/types'

export const categories: Category[] = [
  { id: 'construccion', name: 'Construcción', slug: 'construccion', icon: '🧱', blurb: 'Cemento, fierro, áridos y todo para tu obra gruesa.', subcats: ['Cemento', 'Fierro', 'Áridos', 'Adhesivos', 'Tableros'] },
  { id: 'ferreteria', name: 'Ferretería', slug: 'ferreteria', icon: '🔩', blurb: 'Tornillos, fijaciones, adhesivos y artículos esenciales.', subcats: ['Tornillos', 'Fijaciones', 'Adhesivos', 'Candados', 'Cintas'] },
  { id: 'herramientas', name: 'Herramientas', slug: 'herramientas', icon: '🔧', blurb: 'Eléctricas, manuales y a batería de las mejores marcas.', subcats: ['Taladros', 'Esmeriles', 'Manuales', 'Escaleras', 'Sets'] },
  { id: 'pinturas', name: 'Pinturas', slug: 'pinturas', icon: '🎨', blurb: 'Látex, esmaltes, accesorios y todo para pintar.', subcats: ['Látex', 'Esmaltes', 'Brochas y rodillos', 'Barnices', 'Spray'] },
  { id: 'electricidad', name: 'Electricidad', slug: 'electricidad', icon: '💡', blurb: 'Cables, iluminación, enchufes y materiales eléctricos.', subcats: ['Ampolletas LED', 'Cables', 'Focos', 'Enchufes', 'Automáticos'] },
  { id: 'gasfiteria', name: 'Gasfitería', slug: 'gasfiteria', icon: '🚰', blurb: 'Cañerías, fitting, griferías y soluciones para agua.', subcats: ['Cañerías', 'Fitting', 'Llaves de paso', 'Sellos', 'Bombas'] },
  { id: 'jardin', name: 'Jardín y Agrícola', slug: 'jardin', icon: '🌱', blurb: 'Riego, cuidado de plantas, agro y vida al aire libre.', subcats: ['Riego', 'Fertilizantes', 'Herramientas agrícolas', 'Maquinaria', 'Terraza'] },
  { id: 'banos-cocina', name: 'Baño y Cocina', slug: 'banos-cocina', icon: '🚿', blurb: 'Griferías, lavaplatos, sanitarios y accesorios.', subcats: ['Griferías', 'Lavaplatos', 'WC', 'Tinas', 'Accesorios'] },
  { id: 'pisos', name: 'Pisos y Revestimientos', slug: 'pisos', icon: '🧩', blurb: 'Flotantes, cerámicas, porcelanatos y terminaciones.', subcats: ['Pisos flotantes', 'Cerámicas', 'Porcelanatos', 'Alfombras', 'Perfiles'] },
  { id: 'seguridad', name: 'Seguridad', slug: 'seguridad', icon: '🦺', blurb: 'Protección personal y seguridad para la obra y el hogar.', subcats: ['Guantes', 'Calzado', 'Cascos', 'Lentes', 'Alarmas'] },
  { id: 'maderas', name: 'Maderas y Tableros', slug: 'maderas', icon: '🪵', blurb: 'Pino, terciados, OSB, MDF y molduras.', subcats: ['Pino', 'Terciados', 'OSB', 'MDF', 'Molduras'] },
  { id: 'temporada', name: 'Temporada', slug: 'temporada', icon: '☀️', blurb: 'Climatización, piscinas y productos de cada estación.', subcats: ['Estufas', 'Piscinas', 'Ventilación', 'Camping', 'Aire libre'] },
]

export const warehouses = ['CD Santiago', 'Sucursal La Florida', 'Sucursal Concepción']

/**
 * Catálogo de demostración. `retailPrice` incluye IVA (B2C). `b2bNet` es el
 * neto base para empresas (B2B); `volumeTiers` define descuentos por cantidad.
 */
export const products: Product[] = [
  // ---------- Construcción ----------
  {
    id: 'p-001', sku: 'MIM-CON-4001', ean: '7800001000018', name: 'Cemento Especial 25kg', brand: 'Andescem', supplier: 'Cementos del Sur',
    categoryId: 'construccion', retailPrice: 6490, b2bNet: 3990,
    volumeTiers: [{ minQty: 50, unitNet: 3650 }, { minQty: 500, unitNet: 3290 }],
    unit: 'saco', rating: 4.6, reviews: 254, stock: 1200,
    stockByWarehouse: { 'CD Santiago': 900, 'Sucursal La Florida': 180, 'Sucursal Concepción': 120 },
    description: 'Saco de cemento especial de 25kg para albañilería y estructuras.',
    specs: { Peso: '25 kg', Tipo: 'Especial', Norma: 'NCh148', Uso: 'Estructural' },
    tags: ['Más vendido'], bulky: true, calculator: 'cemento', complementaryIds: ['p-002', 'p-003'],
  },
  {
    id: 'p-002', sku: 'MIM-CON-4002', name: 'Fierro Estriado 8mm x 6m', brand: 'AceroChile',
    categoryId: 'construccion', retailPrice: 4290, b2bNet: 2890,
    volumeTiers: [{ minQty: 100, unitNet: 2690 }, { minQty: 1000, unitNet: 2490 }],
    unit: 'barra', rating: 4.5, reviews: 47, stock: 5000,
    stockByWarehouse: { 'CD Santiago': 4000, 'Sucursal La Florida': 600, 'Sucursal Concepción': 400 },
    description: 'Barra de fierro estriado de 8mm y 6 metros para refuerzo de hormigón.',
    specs: { Diámetro: '8 mm', Largo: '6 m', Grado: 'A630-420H' }, bulky: true,
  },
  {
    id: 'p-003', sku: 'MIM-CON-4003', name: 'Arena Gruesa Ensacada 25kg', brand: 'Áridos Maipo',
    categoryId: 'construccion', retailPrice: 2990, b2bNet: 1690,
    volumeTiers: [{ minQty: 50, unitNet: 1490 }, { minQty: 300, unitNet: 1290 }],
    unit: 'saco', rating: 4.3, reviews: 31, stock: 800,
    stockByWarehouse: { 'CD Santiago': 600, 'Sucursal La Florida': 120, 'Sucursal Concepción': 80 },
    description: 'Arena gruesa lavada, ideal para morteros y hormigones.',
    specs: { Peso: '25 kg', Tipo: 'Gruesa', Uso: 'Mortero' }, bulky: true,
  },
  {
    id: 'p-004', sku: 'MIM-CON-4004', name: 'Plancha OSB Estructural 11mm 1.22x2.44m', brand: 'Maderba',
    categoryId: 'construccion', retailPrice: 18990, b2bNet: 11900,
    volumeTiers: [{ minQty: 30, unitNet: 11200 }, { minQty: 200, unitNet: 10400 }],
    unit: 'plancha', rating: 4.3, reviews: 53, stock: 600,
    stockByWarehouse: { 'CD Santiago': 450, 'Sucursal La Florida': 90, 'Sucursal Concepción': 60 },
    description: 'Plancha OSB estructural de 11mm para tabiques, cubiertas y revestimientos.',
    specs: { Espesor: '11 mm', Medida: '1.22x2.44 m', Uso: 'Estructural' }, bulky: true,
  },

  // ---------- Ferretería ----------
  {
    id: 'p-005', sku: 'MIM-FER-8001', name: 'Caja Tornillos Autoperforantes 6x1" (500u)', brand: 'Fixser',
    categoryId: 'ferreteria', retailPrice: 7990, b2bNet: 4300,
    volumeTiers: [{ minQty: 20, unitNet: 3800 }, { minQty: 100, unitNet: 3300 }],
    unit: 'caja', rating: 4.5, reviews: 132, stock: 400,
    stockByWarehouse: { 'CD Santiago': 300, 'Sucursal La Florida': 60, 'Sucursal Concepción': 40 },
    description: 'Caja con 500 tornillos autoperforantes 6x1", acabado zincado anticorrosión.',
    specs: { Medida: '6x1"', Cantidad: '500', Acabado: 'Zincado' }, tags: ['Más vendido'],
  },
  {
    id: 'p-006', sku: 'MIM-FER-8002', name: 'Silicona Multiuso Transparente 280ml', brand: 'Sellatodo',
    categoryId: 'ferreteria', retailPrice: 3990, retailOffer: 2990, b2bNet: 1750,
    volumeTiers: [{ minQty: 24, unitNet: 1550 }, { minQty: 120, unitNet: 1350 }],
    unit: 'unidad', rating: 4.4, reviews: 210, stock: 520,
    stockByWarehouse: { 'CD Santiago': 380, 'Sucursal La Florida': 80, 'Sucursal Concepción': 60 },
    description: 'Silicona multiuso de alta adherencia para sellado de baños, cocinas y ventanas.',
    specs: { Contenido: '280 ml', Color: 'Transparente', Uso: 'Sellado' }, tags: ['Oferta'],
  },
  {
    id: 'p-007', sku: 'MIM-FER-8003', name: 'Candado de Seguridad 50mm Arco Largo', brand: 'Forte',
    categoryId: 'ferreteria', retailPrice: 8990, b2bNet: 4900,
    volumeTiers: [{ minQty: 12, unitNet: 4400 }, { minQty: 60, unitNet: 3900 }],
    unit: 'unidad', rating: 4.4, reviews: 67, stock: 250,
    stockByWarehouse: { 'CD Santiago': 190, 'Sucursal La Florida': 35, 'Sucursal Concepción': 25 },
    description: 'Candado de seguridad de 50mm con arco largo y 3 llaves de bronce.',
    specs: { Ancho: '50 mm', Arco: 'Largo', Llaves: '3' },
  },

  // ---------- Herramientas ----------
  {
    id: 'p-008', sku: 'MIM-HER-1001', ean: '7800002000017', name: 'Taladro Percutor Inalámbrico 20V 2 Baterías', brand: 'Bauker', supplier: 'Power Tools Ltda.',
    categoryId: 'herramientas', retailPrice: 79990, retailOffer: 64990, b2bNet: 49000,
    volumeTiers: [{ minQty: 5, unitNet: 46500 }, { minQty: 20, unitNet: 43900 }],
    unit: 'unidad', rating: 4.6, reviews: 312, stock: 84,
    stockByWarehouse: { 'CD Santiago': 60, 'Sucursal La Florida': 14, 'Sucursal Concepción': 10 },
    description: 'Taladro percutor inalámbrico de 20V con dos baterías de litio. Perfora madera, metal y concreto. Incluye maletín y cargador rápido.',
    specs: { Voltaje: '20V', Baterías: '2 x 2.0Ah', 'Torque máx.': '45 Nm', Mandril: '13 mm', Potencia: '20V' },
    tags: ['Más vendido'], freeShipping: true, complementaryIds: ['p-005', 'p-009'],
  },
  {
    id: 'p-009', sku: 'MIM-HER-1002', name: 'Set Destornilladores y Puntas 32 piezas', brand: 'Toolmax',
    categoryId: 'herramientas', retailPrice: 18990, b2bNet: 11200,
    volumeTiers: [{ minQty: 10, unitNet: 10300 }, { minQty: 50, unitNet: 9400 }],
    unit: 'set', rating: 4.4, reviews: 98, stock: 220,
    stockByWarehouse: { 'CD Santiago': 180, 'Sucursal La Florida': 22, 'Sucursal Concepción': 18 },
    description: 'Set de 32 puntas y destornilladores de precisión en acero cromo-vanadio.',
    specs: { Piezas: '32', Material: 'Cr-V', Estuche: 'Sí' },
  },
  {
    id: 'p-010', sku: 'MIM-HER-1003', name: 'Esmeril Angular 4.5" 820W', brand: 'Bauker',
    categoryId: 'herramientas', retailPrice: 54990, retailOffer: 47990, b2bNet: 35900,
    volumeTiers: [{ minQty: 5, unitNet: 33900 }],
    unit: 'unidad', rating: 4.7, reviews: 156, stock: 47,
    stockByWarehouse: { 'CD Santiago': 30, 'Sucursal La Florida': 9, 'Sucursal Concepción': 8 },
    description: 'Esmeril angular de 4.5 pulgadas, motor de 820W, ideal para corte y desbaste.',
    specs: { Potencia: '820W', Disco: '115 mm', RPM: '11.000' },
  },
  {
    id: 'p-011', sku: 'MIM-HER-1004', name: 'Escalera Tijera Aluminio 7 Peldaños', brand: 'AltoPro',
    categoryId: 'herramientas', retailPrice: 59990, b2bNet: 38900,
    volumeTiers: [{ minQty: 5, unitNet: 36500 }],
    unit: 'unidad', rating: 4.6, reviews: 91, stock: 70,
    stockByWarehouse: { 'CD Santiago': 50, 'Sucursal La Florida': 12, 'Sucursal Concepción': 8 },
    description: 'Escalera tijera de aluminio de 7 peldaños, liviana y resistente, carga 120kg.',
    specs: { Peldaños: '7', Material: 'Aluminio', 'Carga máx.': '120 kg' }, bulky: true,
  },
  {
    id: 'p-012', sku: 'MIM-HER-1005', name: 'Carretilla Buggy 90L Rueda Neumática', brand: 'Toolmax',
    categoryId: 'herramientas', retailPrice: 44990, retailOffer: 37990, b2bNet: 24900,
    volumeTiers: [{ minQty: 6, unitNet: 22900 }],
    unit: 'unidad', rating: 4.5, reviews: 73, stock: 55,
    stockByWarehouse: { 'CD Santiago': 38, 'Sucursal La Florida': 10, 'Sucursal Concepción': 7 },
    description: 'Carretilla buggy de 90 litros con rueda neumática, ideal para obra y jardín.',
    specs: { Capacidad: '90 L', Rueda: 'Neumática', Estructura: 'Acero' }, tags: ['Oferta'], bulky: true,
  },

  // ---------- Pinturas ----------
  {
    id: 'p-013', sku: 'MIM-PIN-3001', name: 'Látex Interior Lavable Blanco 1 Galón', brand: 'Colormax',
    categoryId: 'pinturas', retailPrice: 24990, retailOffer: 19990, b2bNet: 13900,
    volumeTiers: [{ minQty: 12, unitNet: 12900 }, { minQty: 48, unitNet: 11500 }],
    unit: 'galón', rating: 4.2, reviews: 188, stock: 300,
    stockByWarehouse: { 'CD Santiago': 220, 'Sucursal La Florida': 50, 'Sucursal Concepción': 30 },
    description: 'Pintura látex lavable para interiores, terminación mate, alto poder cubritivo.',
    specs: { Rendimiento: '12 m²/L', Terminación: 'Mate', Secado: '1 h', Color: 'Blanco' },
    tags: ['Oferta'], calculator: 'pintura', complementaryIds: ['p-014', 'p-015'],
  },
  {
    id: 'p-014', sku: 'MIM-PIN-3002', name: 'Rodillo Antigota 9" con Marco', brand: 'Pintec',
    categoryId: 'pinturas', retailPrice: 5990, b2bNet: 3200,
    volumeTiers: [{ minQty: 24, unitNet: 2800 }, { minQty: 100, unitNet: 2400 }],
    unit: 'unidad', rating: 4.3, reviews: 64, stock: 480,
    stockByWarehouse: { 'CD Santiago': 360, 'Sucursal La Florida': 70, 'Sucursal Concepción': 50 },
    description: 'Rodillo antigota de 9 pulgadas con marco metálico, para látex y esmaltes al agua.',
    specs: { Ancho: '9"', Pelo: 'Antigota', Marco: 'Incluido' },
  },
  {
    id: 'p-015', sku: 'MIM-PIN-3003', name: 'Brocha Profesional 3" Cerda Mixta', brand: 'Pintec',
    categoryId: 'pinturas', retailPrice: 4990, b2bNet: 2500,
    volumeTiers: [{ minQty: 24, unitNet: 2150 }, { minQty: 100, unitNet: 1850 }],
    unit: 'unidad', rating: 4.1, reviews: 73, stock: 600,
    stockByWarehouse: { 'CD Santiago': 480, 'Sucursal La Florida': 70, 'Sucursal Concepción': 50 },
    description: 'Brocha profesional de 3 pulgadas con cerda mixta para látex y esmaltes.',
    specs: { Ancho: '3"', Cerda: 'Mixta', Mango: 'Madera' },
  },
  {
    id: 'p-016', sku: 'MIM-PIN-3004', name: 'Esmalte al Agua Satinado Negro 1 Galón', brand: 'Colormax',
    categoryId: 'pinturas', retailPrice: 27990, b2bNet: 16900,
    volumeTiers: [{ minQty: 12, unitNet: 15500 }],
    unit: 'galón', rating: 4.4, reviews: 52, stock: 160,
    stockByWarehouse: { 'CD Santiago': 120, 'Sucursal La Florida': 24, 'Sucursal Concepción': 16 },
    description: 'Esmalte al agua de secado rápido, bajo olor, terminación satinada para maderas y metales.',
    specs: { Rendimiento: '11 m²/L', Terminación: 'Satinado', Color: 'Negro' }, calculator: 'pintura',
  },

  // ---------- Electricidad ----------
  {
    id: 'p-017', sku: 'MIM-ELE-2001', name: 'Ampolleta LED 9W Luz Cálida (Pack 6)', brand: 'Lumen',
    categoryId: 'electricidad', retailPrice: 9990, b2bNet: 5200,
    volumeTiers: [{ minQty: 20, unitNet: 4600 }, { minQty: 100, unitNet: 4100 }],
    unit: 'pack', rating: 4.5, reviews: 410, stock: 540,
    stockByWarehouse: { 'CD Santiago': 420, 'Sucursal La Florida': 70, 'Sucursal Concepción': 50 },
    description: 'Pack de 6 ampolletas LED de 9W, luz cálida 3000K, bajo consumo y larga vida útil.',
    specs: { Potencia: '9W', Temperatura: '3000K', 'Vida útil': '15.000 h', Casquillo: 'E27' }, tags: ['Eco'],
  },
  {
    id: 'p-018', sku: 'MIM-ELE-2002', name: 'Rollo Cable Eléctrico THHN 2.5mm 100m', brand: 'Conducel',
    categoryId: 'electricidad', retailPrice: 44990, b2bNet: 28900,
    volumeTiers: [{ minQty: 10, unitNet: 26900 }, { minQty: 30, unitNet: 24900 }],
    unit: 'rollo', rating: 4.3, reviews: 64, stock: 130,
    stockByWarehouse: { 'CD Santiago': 100, 'Sucursal La Florida': 18, 'Sucursal Concepción': 12 },
    description: 'Rollo de cable THHN 2.5mm² de 100 metros, certificado para instalaciones domiciliarias.',
    specs: { Sección: '2.5 mm²', Largo: '100 m', Certificación: 'SEC' }, calculator: 'cable',
  },
  {
    id: 'p-019', sku: 'MIM-ELE-2003', name: 'Foco LED Exterior 50W IP65', brand: 'Lumen',
    categoryId: 'electricidad', retailPrice: 16990, b2bNet: 9800,
    volumeTiers: [{ minQty: 10, unitNet: 8900 }, { minQty: 40, unitNet: 8100 }],
    unit: 'unidad', rating: 4.5, reviews: 78, stock: 180,
    stockByWarehouse: { 'CD Santiago': 130, 'Sucursal La Florida': 30, 'Sucursal Concepción': 20 },
    description: 'Foco LED para exterior de 50W con protección IP65 contra agua y polvo.',
    specs: { Potencia: '50W', Protección: 'IP65', Luz: '6500K' },
  },
  {
    id: 'p-020', sku: 'MIM-ELE-2004', name: 'Alargador Eléctrico 3 Tomas 5m', brand: 'Conducel',
    categoryId: 'electricidad', retailPrice: 7990, retailOffer: 5990, b2bNet: 3600,
    volumeTiers: [{ minQty: 20, unitNet: 3200 }],
    unit: 'unidad', rating: 4.2, reviews: 145, stock: 260,
    stockByWarehouse: { 'CD Santiago': 200, 'Sucursal La Florida': 35, 'Sucursal Concepción': 25 },
    description: 'Alargador eléctrico de 5 metros con 3 tomas y protección, uso doméstico.',
    specs: { Largo: '5 m', Tomas: '3', Corriente: '10A' }, tags: ['Oferta'],
  },

  // ---------- Gasfitería ----------
  {
    id: 'p-021', sku: 'MIM-GAS-9001', name: 'Tubo PVC Sanitario 110mm x 6m', brand: 'Hidroflex',
    categoryId: 'gasfiteria', retailPrice: 12990, b2bNet: 7800,
    volumeTiers: [{ minQty: 20, unitNet: 7200 }, { minQty: 100, unitNet: 6500 }],
    unit: 'tira', rating: 4.3, reviews: 38, stock: 320,
    stockByWarehouse: { 'CD Santiago': 240, 'Sucursal La Florida': 50, 'Sucursal Concepción': 30 },
    description: 'Tubo PVC sanitario de 110mm y 6 metros para desagües y alcantarillado domiciliario.',
    specs: { Diámetro: '110 mm', Largo: '6 m', Uso: 'Sanitario' }, bulky: true,
  },
  {
    id: 'p-022', sku: 'MIM-GAS-9002', name: 'Llave de Paso PVC 1/2"', brand: 'Hidroflex',
    categoryId: 'gasfiteria', retailPrice: 3490, b2bNet: 1850,
    volumeTiers: [{ minQty: 24, unitNet: 1600 }, { minQty: 100, unitNet: 1400 }],
    unit: 'unidad', rating: 4.1, reviews: 41, stock: 410,
    stockByWarehouse: { 'CD Santiago': 320, 'Sucursal La Florida': 50, 'Sucursal Concepción': 40 },
    description: 'Llave de paso de PVC de 1/2 pulgada para corte de agua en instalaciones domiciliarias.',
    specs: { Medida: '1/2"', Material: 'PVC', Uso: 'Agua fría' },
  },
  {
    id: 'p-023', sku: 'MIM-GAS-9003', name: 'Bomba Presurizadora Automática 120W', brand: 'AquaPro',
    categoryId: 'gasfiteria', retailPrice: 79990, b2bNet: 52000,
    volumeTiers: [{ minQty: 4, unitNet: 49000 }],
    unit: 'unidad', rating: 4.4, reviews: 29, stock: 24,
    stockByWarehouse: { 'CD Santiago': 16, 'Sucursal La Florida': 5, 'Sucursal Concepción': 3 },
    description: 'Bomba presurizadora automática de 120W para mejorar la presión de agua en el hogar.',
    specs: { Potencia: '120W', Caudal: '30 L/min', Conexión: '1/2"' }, freeShipping: true,
  },

  // ---------- Jardín y Agrícola ----------
  {
    id: 'p-024', sku: 'MIM-JAR-6001', name: 'Manguera Reforzada 1/2" x 20m con Conectores', brand: 'Hydro',
    categoryId: 'jardin', retailPrice: 14990, b2bNet: 8200,
    volumeTiers: [{ minQty: 12, unitNet: 7400 }, { minQty: 50, unitNet: 6600 }],
    unit: 'unidad', rating: 4.0, reviews: 44, stock: 150,
    stockByWarehouse: { 'CD Santiago': 110, 'Sucursal La Florida': 22, 'Sucursal Concepción': 18 },
    description: 'Manguera reforzada de 1/2 pulgada y 20 metros, incluye conectores rápidos.',
    specs: { Largo: '20 m', Diámetro: '1/2"', Capas: '3' },
  },
  {
    id: 'p-025', sku: 'MIM-JAR-6002', name: 'Fertilizante Universal NPK 5kg', brand: 'AgroVida',
    categoryId: 'jardin', retailPrice: 9990, b2bNet: 5600,
    volumeTiers: [{ minQty: 20, unitNet: 5000 }, { minQty: 100, unitNet: 4400 }],
    unit: 'saco', rating: 4.6, reviews: 88, stock: 340,
    stockByWarehouse: { 'CD Santiago': 260, 'Sucursal La Florida': 50, 'Sucursal Concepción': 30 },
    description: 'Fertilizante universal NPK 15-15-15 para hortalizas, frutales y jardín.',
    specs: { Peso: '5 kg', Fórmula: 'NPK 15-15-15', Uso: 'Universal' }, tags: ['Más vendido'],
  },
  {
    id: 'p-026', sku: 'MIM-JAR-6003', name: 'Cortadora de Pasto Eléctrica 1400W', brand: 'GardenPro',
    categoryId: 'jardin', retailPrice: 119990, retailOffer: 99990, b2bNet: 69900,
    volumeTiers: [{ minQty: 4, unitNet: 65900 }],
    unit: 'unidad', rating: 4.3, reviews: 58, stock: 33,
    stockByWarehouse: { 'CD Santiago': 22, 'Sucursal La Florida': 6, 'Sucursal Concepción': 5 },
    description: 'Cortadora de pasto eléctrica de 1400W con altura regulable y bolsa recolectora.',
    specs: { Potencia: '1400W', 'Ancho de corte': '37 cm', Recolector: '40 L' }, tags: ['Oferta'], freeShipping: true, bulky: true,
  },
  {
    id: 'p-027', sku: 'MIM-JAR-6004', name: 'Cloro Granulado para Piscina 5kg', brand: 'AquaClear',
    categoryId: 'jardin', retailPrice: 18990, b2bNet: 11500,
    volumeTiers: [{ minQty: 12, unitNet: 10500 }],
    unit: 'balde', rating: 4.5, reviews: 64, stock: 120,
    stockByWarehouse: { 'CD Santiago': 90, 'Sucursal La Florida': 18, 'Sucursal Concepción': 12 },
    description: 'Cloro granulado de disolución rápida para desinfección de piscinas.',
    specs: { Peso: '5 kg', Tipo: 'Granulado', Uso: 'Piscina' }, tags: ['Temporada'],
  },

  // ---------- Baño y Cocina ----------
  {
    id: 'p-028', sku: 'MIM-BAN-5001', name: 'Lavaplatos Acero Inoxidable 1 Pozo', brand: 'Inoxa',
    categoryId: 'banos-cocina', retailPrice: 49990, retailOffer: 42990, b2bNet: 28900,
    volumeTiers: [{ minQty: 8, unitNet: 26900 }],
    unit: 'unidad', rating: 4.4, reviews: 57, stock: 70,
    stockByWarehouse: { 'CD Santiago': 50, 'Sucursal La Florida': 12, 'Sucursal Concepción': 8 },
    description: 'Lavaplatos de acero inoxidable de un pozo con escurridor, incluye sifón.',
    specs: { Material: 'Acero inox', Pozos: '1', Medida: '80x50 cm' }, tags: ['Oferta'], complementaryIds: ['p-029'],
  },
  {
    id: 'p-029', sku: 'MIM-BAN-5002', name: 'Grifería Monomando para Cocina', brand: 'Stretto',
    categoryId: 'banos-cocina', retailPrice: 49990, b2bNet: 29900,
    volumeTiers: [{ minQty: 8, unitNet: 27900 }, { minQty: 30, unitNet: 25900 }],
    unit: 'unidad', rating: 4.5, reviews: 121, stock: 90,
    stockByWarehouse: { 'CD Santiago': 65, 'Sucursal La Florida': 15, 'Sucursal Concepción': 10 },
    description: 'Grifería monomando para cocina con caño giratorio y acabado cromado.',
    specs: { Tipo: 'Monomando', Acabado: 'Cromo', Garantía: '5 años' },
  },
  {
    id: 'p-030', sku: 'MIM-BAN-5003', name: 'WC One Piece con Descarga Dual', brand: 'Sanit',
    categoryId: 'banos-cocina', retailPrice: 129990, b2bNet: 84000,
    volumeTiers: [{ minQty: 5, unitNet: 79000 }],
    unit: 'unidad', rating: 4.6, reviews: 43, stock: 28,
    stockByWarehouse: { 'CD Santiago': 18, 'Sucursal La Florida': 6, 'Sucursal Concepción': 4 },
    description: 'WC one piece con sistema de descarga dual de bajo consumo, incluye asiento.',
    specs: { Tipo: 'One piece', Descarga: 'Dual 3/6L', Asiento: 'Incluido' }, bulky: true, freeShipping: true,
  },

  // ---------- Pisos y Revestimientos ----------
  {
    id: 'p-031', sku: 'MIM-PIS-7001', name: 'Piso Flotante AC4 8mm Roble Natural (m²)', brand: 'Eurostyle',
    categoryId: 'pisos', retailPrice: 8990, retailOffer: 6990, b2bNet: 4200,
    volumeTiers: [{ minQty: 100, unitNet: 3850 }, { minQty: 500, unitNet: 3490 }],
    unit: 'm²', rating: 4.6, reviews: 207, stock: 8000,
    stockByWarehouse: { 'CD Santiago': 6000, 'Sucursal La Florida': 1200, 'Sucursal Concepción': 800 },
    description: 'Piso flotante AC4 de 8mm, resistente al tránsito, sistema click de fácil instalación.',
    specs: { Espesor: '8 mm', Tránsito: 'AC4', Sistema: 'Click', Color: 'Roble' },
    tags: ['Oferta'], calculator: 'piso', complementaryIds: ['p-032'],
  },
  {
    id: 'p-032', sku: 'MIM-PIS-7002', name: 'Cerámica Muro/Piso 45x45 Beige (caja 2m²)', brand: 'Cordillera',
    categoryId: 'pisos', retailPrice: 11990, b2bNet: 6900,
    volumeTiers: [{ minQty: 50, unitNet: 6300 }, { minQty: 200, unitNet: 5700 }],
    unit: 'caja', rating: 4.2, reviews: 86, stock: 1400,
    stockByWarehouse: { 'CD Santiago': 1000, 'Sucursal La Florida': 240, 'Sucursal Concepción': 160 },
    description: 'Cerámica esmaltada de 45x45 cm, caja rinde 2 m², apta para muro y piso interior.',
    specs: { Formato: '45x45 cm', Rendimiento: '2 m²/caja', Uso: 'Muro/Piso' }, calculator: 'piso',
  },

  // ---------- Seguridad ----------
  {
    id: 'p-033', sku: 'MIM-SEG-1101', name: 'Guantes de Seguridad Nitrilo (Par)', brand: 'SafeGrip',
    categoryId: 'seguridad', retailPrice: 2990, b2bNet: 1500,
    volumeTiers: [{ minQty: 50, unitNet: 1300 }, { minQty: 200, unitNet: 1100 }],
    unit: 'par', rating: 4.4, reviews: 156, stock: 900,
    stockByWarehouse: { 'CD Santiago': 700, 'Sucursal La Florida': 120, 'Sucursal Concepción': 80 },
    description: 'Guantes de seguridad recubiertos en nitrilo, alta resistencia y agarre.',
    specs: { Material: 'Nitrilo', Talla: 'L', Norma: 'EN388' }, tags: ['Más vendido'],
  },
  {
    id: 'p-034', sku: 'MIM-SEG-1102', name: 'Botas de Seguridad Punta de Acero', brand: 'SafeStep',
    categoryId: 'seguridad', retailPrice: 32990, retailOffer: 27990, b2bNet: 18900,
    volumeTiers: [{ minQty: 12, unitNet: 17500 }, { minQty: 50, unitNet: 16200 }],
    unit: 'par', rating: 4.5, reviews: 92, stock: 140,
    stockByWarehouse: { 'CD Santiago': 100, 'Sucursal La Florida': 24, 'Sucursal Concepción': 16 },
    description: 'Botas de seguridad con punta de acero y suela antideslizante, certificadas.',
    specs: { Punta: 'Acero', Suela: 'Antideslizante', Norma: 'ISO 20345' }, tags: ['Oferta'],
  },
  {
    id: 'p-035', sku: 'MIM-SEG-1103', name: 'Casco de Seguridad con Ajuste Ratchet', brand: 'SafeGrip',
    categoryId: 'seguridad', retailPrice: 7990, b2bNet: 4300,
    volumeTiers: [{ minQty: 20, unitNet: 3900 }, { minQty: 100, unitNet: 3400 }],
    unit: 'unidad', rating: 4.3, reviews: 48, stock: 260,
    stockByWarehouse: { 'CD Santiago': 200, 'Sucursal La Florida': 35, 'Sucursal Concepción': 25 },
    description: 'Casco de seguridad con arnés de ajuste ratchet, liviano y ventilado.',
    specs: { Ajuste: 'Ratchet', Material: 'ABS', Norma: 'EN397' },
  },

  // ---------- Maderas y Tableros ----------
  {
    id: 'p-036', sku: 'MIM-MAD-1201', name: 'Pino Cepillado 2x2" x 3.2m', brand: 'Maderba',
    categoryId: 'maderas', retailPrice: 3290, b2bNet: 1990,
    volumeTiers: [{ minQty: 50, unitNet: 1790 }, { minQty: 300, unitNet: 1590 }],
    unit: 'pieza', rating: 4.2, reviews: 36, stock: 1200,
    stockByWarehouse: { 'CD Santiago': 900, 'Sucursal La Florida': 180, 'Sucursal Concepción': 120 },
    description: 'Listón de pino cepillado seco de cámara, 2x2 pulgadas y 3.2 metros.',
    specs: { Sección: '2x2"', Largo: '3.2 m', Secado: 'Cámara' }, bulky: true,
  },
  {
    id: 'p-037', sku: 'MIM-MAD-1202', name: 'Tablero MDF 15mm 1.83x2.44m', brand: 'Maderba',
    categoryId: 'maderas', retailPrice: 26990, b2bNet: 16900,
    volumeTiers: [{ minQty: 20, unitNet: 15900 }, { minQty: 100, unitNet: 14900 }],
    unit: 'plancha', rating: 4.4, reviews: 41, stock: 380,
    stockByWarehouse: { 'CD Santiago': 280, 'Sucursal La Florida': 60, 'Sucursal Concepción': 40 },
    description: 'Tablero MDF de 15mm, superficie lisa ideal para muebles y proyectos de carpintería.',
    specs: { Espesor: '15 mm', Medida: '1.83x2.44 m', Material: 'MDF' }, bulky: true, complementaryIds: ['p-005'],
  },

  // ---------- Temporada ----------
  {
    id: 'p-038', sku: 'MIM-TEM-1301', name: 'Estufa a Gas Infrarroja 4200 kcal', brand: 'CalorHome',
    categoryId: 'temporada', retailPrice: 89990, retailOffer: 74990, b2bNet: 49900,
    volumeTiers: [{ minQty: 6, unitNet: 46900 }],
    unit: 'unidad', rating: 4.4, reviews: 77, stock: 60,
    stockByWarehouse: { 'CD Santiago': 42, 'Sucursal La Florida': 11, 'Sucursal Concepción': 7 },
    description: 'Estufa a gas infrarroja de 4200 kcal con encendido automático y triple seguridad.',
    specs: { Potencia: '4200 kcal', Encendido: 'Automático', Seguridad: 'Triple' }, tags: ['Temporada'], freeShipping: true,
  },
  {
    id: 'p-039', sku: 'MIM-TEM-1302', name: 'Ventilador de Pie 16" 3 Velocidades', brand: 'AirCool',
    categoryId: 'temporada', retailPrice: 24990, retailOffer: 19990, b2bNet: 13900,
    volumeTiers: [{ minQty: 8, unitNet: 12900 }],
    unit: 'unidad', rating: 4.2, reviews: 110, stock: 95,
    stockByWarehouse: { 'CD Santiago': 70, 'Sucursal La Florida': 15, 'Sucursal Concepción': 10 },
    description: 'Ventilador de pie de 16 pulgadas con 3 velocidades y altura ajustable.',
    specs: { Aspas: '16"', Velocidades: '3', Altura: 'Ajustable' }, tags: ['Oferta'],
  },
  {
    id: 'p-040', sku: 'MIM-TEM-1303', name: 'Piscina Estructural 300x175x80cm', brand: 'AquaClear',
    categoryId: 'temporada', retailPrice: 99990, b2bNet: 64900,
    volumeTiers: [{ minQty: 4, unitNet: 61900 }],
    unit: 'unidad', rating: 4.3, reviews: 35, stock: 18,
    stockByWarehouse: { 'CD Santiago': 12, 'Sucursal La Florida': 4, 'Sucursal Concepción': 2 },
    description: 'Piscina estructural con armazón de acero, incluye bomba filtrante.',
    specs: { Medida: '300x175x80 cm', Capacidad: '2.900 L', Bomba: 'Incluida' }, tags: ['Temporada'], bulky: true, onlineOnly: true,
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function productsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId)
}
