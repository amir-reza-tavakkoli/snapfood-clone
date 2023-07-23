export default function AboutPage() {
  return (
    <main>
      <h1>درباره اسنپ فود Clone</h1>
      <picture>
        <source media="(max-width: 799px)" srcSet="./public/vendor-img-big.png" />
        <source media="(min-width: 800px)" srcSet="./public/vendor-img-big.png" />
        <img
          src="./public/vendor-img-big.png"
          alt="Chris standing up holding his daughter Elva"
        />
      </picture>
    </main>
  )
}
