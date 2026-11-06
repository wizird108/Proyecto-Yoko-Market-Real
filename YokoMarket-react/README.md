# YokoMarket — React

Marketplace de merch de **Álvaro Díaz**: productos de la tienda oficial y artículos que publican otros fans (reventa).

Es la migración a **React** de la entrega anterior, hecha con HTML, CSS y JavaScript. El objetivo fue que la página se vea y funcione **igual que la versión anterior**, pero construida con componentes, rutas y estado global, siguiendo lo visto en el curso *Diseñando con Algoritmos* (S1–S10).

---

## Tecnologías

| Herramienta | Para qué se usa |
|---|---|
| **React 19** | Componentes, props y hooks (`useState`, `useEffect`, `useContext`). |
| **TypeScript** | Tipos para productos, sesión y bolsa (`interface`, `type`). |
| **Vite** | Crear, ejecutar y compilar el proyecto. |
| **React Router 7** | Páginas y navegación (modo Data: `createBrowserRouter` + `RouterProvider`). |
| **CSS** | Los mismos estilos de la entrega anterior (sin frameworks). |
| **localStorage** | Guardar sesión, cuentas, publicaciones, favoritos y bolsa en el navegador. |

---

## Cómo ejecutarlo

Requisitos: **Node.js** y **npm**.

```bash
cd YokoMarket-react
npm install        # instala las dependencias
npm run dev        # abre la página en http://localhost:5173
```

Otros comandos:

```bash
npm run build      # revisa los tipos y genera la versión final en /dist
npm run lint       # revisa el código con ESLint
npm run preview    # muestra la versión de /dist
```

**Cuenta de prueba:** `fan@yokomarket.com` / `123456`. También se puede crear una cuenta en **Registro**.

---

## Páginas (rutas)

| Ruta | Página |
|---|---|
| `/` | Inicio: banner Sayonara, Destacados, Tienda Oficial y Reventa |
| `/ropa`, `/peluches`, `/vinilos`, `/accesorios`, `/sale` | Catálogos con filtros (género, ubicación, precio, estado y talla) |
| `/catalogo` | Redirige a peluches (como `catalogo.html` del original) |
| `/producto/:id` | Detalle: tallas, fotos, contactar, añadir a la bolsa y reseñas |
| `/busqueda` | Inicio con el panel de búsqueda abierto |
| `/carrito` | Inicio con la bolsa de compras abierta |
| `/login`, `/registro` | Iniciar sesión y crear cuenta |
| `/perfil` 🔒 | Estadísticas, Mis anuncios y Wishlist |
| `/publicar` 🔒 | Publicar un producto con fotos |
| `/ayuda` | Preguntas frecuentes |

🔒 = pide sesión. Sin sesión, `RutaProtegida` lleva a `/login`.

Cualquier otra URL vuelve al inicio.

---

## Estructura de carpetas

Sigue la estructura vista en S9 (*Estructura de Proyecto React*) y S10.

```
YokoMarket-react/
├── index.html                 Página base: React dibuja todo dentro de <div id="root">
└── src/
    ├── main.tsx               Punto de entrada: carga los estilos y el router
    ├── router/
    │   └── Router.tsx         Lista de rutas (URL → página)
    ├── layout/
    │   ├── Auth/Auth.tsx      Sesión del usuario (contexto global, como el ejemplo de S10)
    │   └── Main/Main.tsx      Molde de las páginas: header, página, footer, avisos y paneles
    ├── context/
    │   ├── FavoritosContext.tsx   Favoritos (estado global + localStorage)
    │   └── CarritoContext.tsx     Bolsa de compras (estado global + localStorage)
    ├── components/            Piezas reutilizables
    │   ├── Header.tsx, Footer.tsx
    │   ├── ProductCard.tsx, ImagenProducto.tsx, BotonFavorito.tsx
    │   ├── CapaPanel.tsx, PanelBusqueda.tsx, PanelCarrito.tsx
    │   ├── RutaProtegida.tsx, CuentaHero.tsx
    ├── pages/                 Una carpeta por página
    │   ├── home/, catalogo/, producto/, ayuda/
    │   └── login/, registro/, perfil/, publicar/
    ├── data/
    │   ├── productos.ts       Productos, tipo Producto, búsquedas y configuración de catálogos
    │   └── usuarios.ts        Cuenta de prueba y tipos de cuenta y sesión
    ├── hooks/
    │   └── useTitulo.ts       Hook personalizado: título de la pestaña
    ├── utils/
    │   ├── almacenamiento.ts  leerDatos() y guardarDatos() para localStorage
    │   └── formato.ts         precioTexto(): "COP $45.000"
    ├── styles/                CSS (ver "Estilos")
    └── assets/                Fuentes, íconos e imágenes
```

### Cómo se conectan las rutas

```
Auth                → da la sesión (useAuth) a todo lo de adentro
└── Main            → header + <Outlet /> + footer; da favoritos y bolsa
    └── páginas     → Home, Catálogo, Producto, Login, Perfil, Publicar...
```

Cada layout usa `<Outlet />`, el "hueco" donde React Router pone la página de la URL actual.

---

## Estado global y persistencia

Se usa **Context** (`createContext` + `useContext`), el mismo patrón del ejemplo de autenticación de S10. Cada contexto guarda sus datos en `localStorage` para que no se pierdan al recargar.

| Contexto | Hook | Qué guarda | Clave en localStorage |
|---|---|---|---|
| Sesión (`layout/Auth`) | `useAuth()` | Usuario que inició sesión (sin contraseña) | `yoko-sesion` |
| Favoritos | `useFavoritos()` | IDs de los productos con corazón | `yoko-favoritos` |
| Bolsa | `useCarrito()` | Filas `{ id, talla, cantidad }` | `yoko-carrito` |

Otras claves:

- `yoko-cuentas`: cuentas creadas en Registro.
- `yoko-publicaciones`: productos publicados por usuarios. Aparecen en Reventa, en los catálogos y en la búsqueda.

> Es un prototipo: no hay servidor ni autenticación real. Todo vive en el navegador.

---

## Estilos

| Archivo | Contenido |
|---|---|
| `style.css` | Estilos base de la entrega anterior, sin cambios. |
| `sistema.css` | Formularios y páginas de cuenta. Las reglas son las originales, pero van envueltas en `:where(.pagina-cuenta)`, porque antes solo se cargaban en login, registro, perfil y publicar. |
| `ajustes.css` | Correcciones finales de la entrega anterior, sin cambios. |
| `cambios.css` | **Solo los cambios nuevos de la versión React** (ver abajo). |

Se cargan en ese orden en `main.tsx`. Si dos reglas pesan igual, gana la última.

### Cambios de diseño respecto a la entrega anterior

- En pantallas de más de 1440px, el header, el footer y los banners ocupan todo el ancho.
- Vinilos (azul) y Accesorios (dorado) ahora también tienen el banner "favorito" que antes solo tenía Peluches.
- Las redes del footer abren los perfiles, y "Ayuda" lleva a la página `/ayuda`. Antes solo mostraban un aviso.

Fuera de eso, todas las pantallas se compararon con la entrega anterior en escritorio (1440px) y celular (390px) y se ven idénticas.

---

## Flujo de trabajo con Git (S1)

Se usa **Git Flow**:

- `main`: versión entregada.
- `develop`: integración del trabajo terminado.
- `feature/*`: una rama por funcionalidad, que se une a `develop` con un Pull Request.

| Rama | Contenido |
|---|---|
| `feature/diseno-catalogo` | Base, layout, inicio, catálogos, búsqueda y detalle |
| `feature/cuentas-interacciones` | Sesión, perfil, publicar, favoritos y bolsa |
