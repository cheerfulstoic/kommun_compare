<template>
  <div>
    <div class="image-container">
      <a href="https://www.aktuellhallbarhet.se/"><img src="../assets/aktuell-hallbarhet-logo.png" alt="Aktuell Hållberhet logo"></a>
      <a href="https://www.klimatsekretariatet.se/"><img src="../assets/klimat-sekretariatet-logo-red.png" alt="Klimat Sekretariatet logo"></a>
    </div>

    <header class="hero is-medium">
      <div class="hero-body content">
        <div class="container">
          <h1>Statistisk klimatrankning</h1>

          <p class="subtitle">
            Med start 2020 ingår en statistisk utvärdering av kommunernas utsläpp av växthusgaser i rankningen av Årets miljöbästa kommun. Denna statistiska klimatrankning utförs i ett samarbete mellan Aktuell Hållbarhet och Klimatsekretariatet. Den står för 20 procent av det samlade rankningsvärdet (maximalt tio poäng) när vi utser Årets miljöbästa kommun. Vi använder oss i denna utvärdering av statistik från Naturvårdsverket. Här nedan kan du se och utforska 2020 års poäng både visuellt och i tabellform.
          </p>

          <h4>Mer om 2020 års statistiska klimatrankning</h4>
          <p>
            I årets statistiska klimatrankning har vi ett extra fokus på koldioxid. Vi jämför först kommunerna med varandra i de två nyckeltalen Utsläpp växthusgaser totalt och Utsläpp koldioxid totalt. Här jämför vi alltså såväl kommunernas samlade utsläpp av växthusgaser som deras samlade utsläpp av enbart koldioxid under de senaste fem publicerade statistiska mätperioderna.
          </p>
          <p>
            Vi utvärderar sedan hur snabbt utsläppen minskar – eller i några fall ökar – inom din kommun över en femårsperiod i de två nyckeltalen Förändringstakt utsläpp totalt och Förändringstakt utsläpp koldioxid. Här sker alltså ingen jämförelse mellan kommunerna, utan det är den procentuella förändringstakten (minskningen eller ökningen av utsläppen) inom kommunen som vi värderar.
          </p>

          <a href="#" v-on:click="$emit('open', $event)">Så här har vi räknat.</a>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
@media screen and (min-width: 769px) {
  .hero.is-medium .hero-body {
    padding-bottom: 7rem;
    padding-top: 4rem;
  }
}

@media screen and (min-width: 1408px) {
  .container,
  .image-container {
    max-width: 1000px;
    margin-left: 13%;
    padding-left: 40px;
  }
}

.content h1 {
  font-size: 2.8rem;
}

.subtitle {
  line-height: 1.45;
}

.content h4 {
  font-size: 1.5rem;
  margin-top: 6px;
  margin-bottom: 8px;
}

.image-container {
  display: flex;
  padding: 30px 1.5rem 20px calc(40px + 1.5rem);
}

.image-container img {
  display: block;
  max-width: 200px;
}

.image-container a:not(:first-child) {
  margin-left: 60px;
  margin-top: 2px;
}
</style>
