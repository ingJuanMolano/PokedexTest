## Tecnologías y decisiones tomadas

La aplicación fue realizada con Vue 3 usando Composition API y `<script setup>`, principalmente porque me pareció una forma más ágil de trabajar los componentes mientras iba desarrollando la aplicación, aunque me desenvuelvo mejor usando option API.

Al principio pensé en usar Vuetify para la parte visual, pero al final decidí hacerlo con Tailwind CSS porque me daba más libertad para modificar los estilos y a parte traia consigo algunas animaciones que mas adelante fueron implementadas.

Para las peticiones a la API utilicé Axios y para manejar los Pokémon favoritos se implementó un store PINIA, con el objetivo de mantener esa información disponible en las diferentes vistas. Se usó PINIA por encima del Store predeterminado de vue (VUEX) ya que actualmente PINIA tiene mayores ventajas y es el mas usado; no se puede negar que la sencillez de PINIA, al lado de VUEX, y la facil integración con composition API, es imprescindible hoy día.

También se utilizó ESLint como herramienta de apoyo para mantener un código más ordenado y evitar errores comunes durante el desarrollo.

En cuanto al diseño, se tomó como base el Figma entregado, pero también se agregaron ideas propias inspiradas en tendencias de diseño actual (https://www.figma.com/es-la/resource-library/tendencias-diseno-web/), como el uso de elementos grandes y llamativos (en la vista de detalle del Pokémon). También se agregaron pequeñas animaciones para que la aplicación se sintiera un poco más dinámica.

Para la carga de información se implementó paginación hecha a mano bastante sencilla haciendo uso del offset y limit propuesto para la API pokédex, evitando traer todos los Pokémon al mismo tiempo y haciendo que la navegación fuera más fluida.

# Pokédex

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
