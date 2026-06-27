export interface SubCategory {
  name: string
  children: string[]
}

/** Árbol de 3 niveles: categoría → subcategoría → sub-subcategorías. */
export const categoryTree: Record<string, SubCategory[]> = {
  construccion: [
    { name: 'Cemento y Hormigón', children: ['Cemento', 'Hormigón premezclado', 'Mortero', 'Cal', 'Yeso'] },
    { name: 'Fierro y Acero', children: ['Fierro estriado', 'Malla Acma', 'Perfiles', 'Clavos', 'Alambre'] },
    { name: 'Áridos', children: ['Arena', 'Gravilla', 'Ripio', 'Estabilizado'] },
    { name: 'Maderas y Tableros', children: ['Pino dimensionado', 'Terciado', 'OSB', 'MDF', 'Molduras'] },
    { name: 'Techumbre', children: ['Planchas zinc', 'Policarbonato', 'Fieltro', 'Canaletas'] },
  ],
  herramientas: [
    { name: 'Herramientas Eléctricas', children: ['Taladros', 'Esmeriles', 'Sierras', 'Lijadoras', 'Rotomartillos'] },
    { name: 'A Batería', children: ['Atornilladores', 'Taladros inalámbricos', 'Combos'] },
    { name: 'Herramientas Manuales', children: ['Martillos', 'Llaves', 'Alicates', 'Destornilladores', 'Huinchas'] },
    { name: 'Maquinaria', children: ['Generadores', 'Compresores', 'Soldadoras', 'Motobombas'] },
    { name: 'Escaleras y Andamios', children: ['Escaleras tijera', 'Telescópicas', 'Andamios'] },
    { name: 'Accesorios', children: ['Brocas', 'Discos', 'Puntas', 'Sets'] },
  ],
  ferreteria: [
    { name: 'Tornillos y Fijaciones', children: ['Tornillos', 'Pernos', 'Tarugos', 'Clavos', 'Anclajes'] },
    { name: 'Adhesivos y Selladores', children: ['Siliconas', 'Adhesivos', 'Cintas', 'Espumas'] },
    { name: 'Candados y Cerraduras', children: ['Candados', 'Cerraduras', 'Pestillos', 'Bisagras'] },
    { name: 'Seguridad (EPP)', children: ['Guantes', 'Cascos', 'Lentes', 'Calzado', 'Protección auditiva'] },
    { name: 'Organización', children: ['Cajas', 'Estanterías', 'Ganchos'] },
  ],
  pinturas: [
    { name: 'Pinturas Interior', children: ['Látex', 'Esmalte al agua', 'Antimanchas'] },
    { name: 'Pinturas Exterior', children: ['Látex exterior', 'Óleo opaco', 'Impermeabilizantes'] },
    { name: 'Esmaltes y Barnices', children: ['Esmalte sintético', 'Barnices', 'Lacas'] },
    { name: 'Accesorios', children: ['Brochas', 'Rodillos', 'Bandejas', 'Lijas', 'Cintas masking'] },
    { name: 'Spray y Aerosoles', children: ['Spray color', 'Anticorrosivo'] },
  ],
  gasfiteria: [
    { name: 'Cañerías y Tubos', children: ['PVC sanitario', 'PVC presión', 'Cobre', 'HDPE'] },
    { name: 'Fitting y Conexiones', children: ['Codos', 'Tee', 'Coplas', 'Uniones'] },
    { name: 'Llaves y Válvulas', children: ['Llaves de paso', 'Flexibles', 'Válvulas'] },
    { name: 'Electricidad', children: ['Cables', 'Enchufes', 'Interruptores', 'Automáticos', 'Tableros'] },
    { name: 'Iluminación', children: ['Ampolletas LED', 'Focos', 'Tubos LED', 'Reflectores'] },
    { name: 'Bombas y Estanques', children: ['Bombas', 'Presurizadoras', 'Estanques'] },
  ],
  jardin: [
    { name: 'Riego', children: ['Mangueras', 'Aspersores', 'Riego por goteo', 'Conectores'] },
    { name: 'Cuidado de Plantas', children: ['Fertilizantes', 'Sustratos', 'Macetas', 'Semillas'] },
    { name: 'Maquinaria Jardín', children: ['Cortadoras', 'Orilladoras', 'Motosierras', 'Sopladoras'] },
    { name: 'Agrícola', children: ['Herramientas agrícolas', 'Mallas', 'Insumos'] },
    { name: 'Terraza y Quincho', children: ['Toldos', 'Pérgolas', 'Quinchos'] },
  ],
  bano: [
    { name: 'Vanitorios y Lavamanos', children: ['Muebles vanitorio', 'Lavamanos', 'Pedestales'] },
    { name: 'WC y Bidet', children: ['WC one piece', 'WC dos piezas', 'Estanques', 'Bidet'] },
    { name: 'Tinas y Receptáculos', children: ['Tinas', 'Receptáculos', 'Cabinas de ducha'] },
    { name: 'Griferías Baño', children: ['Lavamanos', 'Ducha', 'Monomando'] },
    { name: 'Accesorios', children: ['Toalleros', 'Espejos', 'Repisas', 'Cortinas'] },
  ],
  cocina: [
    { name: 'Lavaplatos', children: ['1 pozo', '2 pozos', 'Sobreponer', 'Bajo cubierta'] },
    { name: 'Griferías Cocina', children: ['Monomando', 'Extraíbles', 'Con purificador'] },
    { name: 'Campanas', children: ['Decorativas', 'Empotrables', 'Telescópicas'] },
    { name: 'Menaje', children: ['Ollas', 'Sartenes', 'Cuchillería', 'Vajilla'] },
    { name: 'Organización', children: ['Organizadores', 'Basureros', 'Repisas'] },
  ],
  electrohogar: [
    { name: 'Climatización', children: ['Estufas', 'Aire acondicionado', 'Calefactores', 'Termos'] },
    { name: 'Ventilación', children: ['Ventiladores', 'Purificadores'] },
    { name: 'Refrigeración', children: ['Refrigeradores', 'Freezers', 'Frigobar'] },
    { name: 'Línea Blanca', children: ['Cocinas', 'Hornos', 'Microondas', 'Encimeras'] },
    { name: 'Lavado', children: ['Lavadoras', 'Secadoras'] },
  ],
  pisos: [
    { name: 'Pisos Flotantes', children: ['AC4', 'AC5', 'SPC', 'Vinílicos'] },
    { name: 'Cerámicas y Porcelanatos', children: ['Cerámica muro', 'Cerámica piso', 'Porcelanato'] },
    { name: 'Adhesivos y Fragües', children: ['Adhesivos', 'Fragües', 'Niveladores'] },
    { name: 'Alfombras y Pasto', children: ['Alfombras', 'Pasto sintético'] },
    { name: 'Perfiles y Guardapolvos', children: ['Guardapolvos', 'Perfiles', 'Narices'] },
  ],
  decoracion: [
    { name: 'Iluminación Decorativa', children: ['Lámparas colgantes', 'Apliques', 'Veladores', 'Tiras LED'] },
    { name: 'Espejos', children: ['Redondos', 'Cuerpo entero', 'Con marco'] },
    { name: 'Cuadros y Láminas', children: ['Cuadros', 'Láminas', 'Repisas'] },
    { name: 'Cortinas y Textil', children: ['Cortinas', 'Roller', 'Cojines', 'Alfombras deco'] },
    { name: 'Plantas Artificiales', children: ['Plantas', 'Maceteros deco'] },
  ],
  dormitorio: [
    { name: 'Colchones', children: ['1 plaza', '1.5 plazas', '2 plazas', 'King'] },
    { name: 'Camas y Respaldos', children: ['Camas', 'Box spring', 'Respaldos'] },
    { name: 'Veladores y Cómodas', children: ['Veladores', 'Cómodas'] },
    { name: 'Ropa de Cama', children: ['Sábanas', 'Plumones', 'Cubrecamas', 'Almohadas'] },
    { name: 'Clósets y Organización', children: ['Clósets', 'Organizadores'] },
  ],
  muebles: [
    { name: 'Living', children: ['Sofás', 'Sillones', 'Mesas de centro', 'Racks TV'] },
    { name: 'Comedor', children: ['Mesas', 'Sillas', 'Aparadores'] },
    { name: 'Escritorios y Oficina', children: ['Escritorios', 'Sillas de oficina', 'Bibliotecas'] },
    { name: 'Estantes y Repisas', children: ['Estantes', 'Repisas', 'Cajoneras'] },
    { name: 'Muebles Exterior', children: ['Juegos de terraza', 'Reposeras'] },
  ],
  'aire-libre': [
    { name: 'Piscinas', children: ['Estructurales', 'Inflables', 'Bombas', 'Químicos'] },
    { name: 'Camping', children: ['Carpas', 'Sacos de dormir', 'Sillas', 'Cooler'] },
    { name: 'Parrillas y Quincho', children: ['Parrillas', 'Ahumadores', 'Carbón', 'Accesorios'] },
    { name: 'Mascotas', children: ['Camas', 'Platos', 'Casas', 'Alimento', 'Juguetes'] },
    { name: 'Outdoor', children: ['Toldos', 'Hamacas'] },
  ],
  automovil: [
    { name: 'Lubricantes', children: ['Aceite motor', 'Refrigerante', 'Aditivos'] },
    { name: 'Accesorios Interior', children: ['Cubre asientos', 'Pisos', 'Organizadores'] },
    { name: 'Iluminación Auto', children: ['Ampolletas', 'Focos LED', 'Neblineros'] },
    { name: 'Limpieza Auto', children: ['Shampoo', 'Ceras', 'Aspiradoras'] },
    { name: 'Audio y Electrónica', children: ['Radios', 'Parlantes', 'Cargadores'] },
  ],
}
