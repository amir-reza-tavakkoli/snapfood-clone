import { LinksFunction, V2_MetaFunction } from "@remix-run/node"

import pageCss from "./styles/about-page.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: pageCss }]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: `About SnappFood Clone
        `,
    title: `About SnappFood Clone`,
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <h1>About SnappFood Clone</h1>
      <picture>
        <source
          media="(max-width: 799px)"
          srcSet="https://i.postimg.cc/vmpWHbmJ/vendor-img-big.png"
        />
        <source
          media="(min-width: 800px)"
          srcSet="https://i.postimg.cc/vmpWHbmJ/vendor-img-big.png"
        />
        <img
          src="https://i.postimg.cc/vmpWHbmJ/vendor-img-big.png"
          alt="Chris standing up holding his daughter Elva"
        />
      </picture>
      <h2>Overview</h2>
      <p>
        <a href="https://github.com/amir-reza-tavakkoli/snappfood-clone">
          Snapfood Clone
        </a>
        is a student-developed project by
        <a href="(https://github.com/amir-reza-tavakkoli)">
          Amir Reza Tavakoli
        </a>
        , trying to mock one of the biggest food delivery services in Iran with
        different web technologies, just for learning purposes. Using the newest
        web technologies like:
      </p>
      <ul>
        <li> React </li>
        <li> Remix </li>
        <li> container queries </li>
        <li> Web vitals </li>
        <li> ... </li>
      </ul>
      <p>
        A complete new design and development method is used as opposed to its
        original corporate counterparts. This project is only meant to be a
        bachelor's degree project for Shiraz University,
        <strong>
          all rights are reserved for
          <a href="https://snapp.ir/"> Snapp and Snappfood </a>corporates.
        </strong>
      </p>
      <h2>Features</h2>
      <p>
        A lot of effort is made in the development process, to emphasize certain
        parts, the project :
      </p>
      <ul>
        <li> is A11y-friendly, as it:</li>
        <ul>
          <li> uses semantic elements</li>
          <li> follows the right element roles and landmarks</li>
          <li> follows the right document hierarchy</li>
          <li> uses live regions</li>
          <li>
            has the right tab order and keyboard interoperability and focus
            management
          </li>
          <li> uses appropriate ARIA attributes</li>
          <li> is tested for screen reader navigability</li>
          <li> has high contrast mode and coarse mode</li>
          <li> is WCAG 2.1 compliant</li>
        </ul>
        <li> has clear CSS without any collisions</li>
        <li> is tree-shaked appropriately</li>
        <li> works when Javascript is disabled when only HTML is available</li>
        <li> relies on standard web requests and responses using Web forms</li>
        <li> is type-safe with Typescript</li>
        <li> has a containerized database using Docker</li>
        <li> has escaped inputs and encrypted data on the fly</li>
        <li> is fully responsive in every mode and screen size</li>
        <li> incorporates dark mode</li>
        <li> is checked for maximum browser compatibility</li>
        <li> uses Pollyfills</li>
        <li> is Web vitals compliant</li>
        <li> works in both RTL and LTR directionalities</li>
        <li> is server-side rendered, so is SEO-friendly</li>
        <li> and many more.</li>
      </ul>
    </main>
  )
}
