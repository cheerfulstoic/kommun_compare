<template>
  <div :class="{ modal: true, 'is-active': is_open }">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="box content">
        <h2>Så här har vi räknat</h2>

        <h4>Årets nyckeltal</h4>

        <ol>
          <li>
            <span class="is-block has-text-weight-semibold">
              Utsläpp växthusgaser totalt (2 – 0 poäng)
            </span>
            Det vi jämför är kommunernas genomsnittliga per capita-utsläpp av
            växthusgaser under de senast fem publicerade mätperioderna. Bästa
            kommun (lägst genomsnittligt utsläpp per capita) får 2 poäng och
            sedan i fallande skala. Utsläppen från industri och utrikes
            transporter har vi exkluderat i detta nyckeltal för att göra en mer
            rättvis bedömning för kommuner som har en eller flera industrier
            inom sitt geografiska område.
          </li>
          <li>
            <span class="is-block has-text-weight-semibold">
              Utsläpp koldioxid totalt (2 – 0 poäng)
            </span>
            Det vi jämför är kommunernas genomsnittliga per capita-utsläpp av
            koldioxid under de senast fem publicerade mätperioderna. Bästa
            kommun (lägst genomsnittligt utsläpp per capita) får 2 poäng och
            sedan i fallande skala. Utsläppen från industri och utrikes
            transporter har vi exkluderat i detta nyckeltal för att göra en mer
            rättvis bedömning för kommuner som har en eller flera industrier
            inom sitt geografiska område.
          </li>
          <li>
            <span class="is-block has-text-weight-semibold">
              Förändringstakt utsläpp totalt (3 – −2 poäng)
            </span>
            Här värderar vi hur utsläppen av växthusgaser har förändrats inom
            den enskilda kommunen. Det vi jämför är hur utsläppen förändrats
            mellan de fem senaste mätperioderna. Kommunen med bäst resultat
            (störst utsläppsminskningstakt uttryckt i procent) får 3 poäng sedan
            i fallande skala. De kommuner som har ökat sina utsläpp får upp till
            2 minuspoäng. I detta nyckeltal inkluderas industrin för att påvisa
            ökningar eller minskningar.
          </li>
          <li>
            <span class="is-block has-text-weight-semibold">
              Förändringstakt utsläpp koldioxid (3 – −2 poäng)
            </span>
            Här värderar vi hur utsläppen av koldioxid har förändrats inom den
            enskilda kommunen. Det vi jämför är hur utsläppen förändrats mellan
            de fem senaste mätperioderna. Kommunen med bäst resultat (störst
            utsläppsminskningstakt uttryckt i procent) får 3 poäng sedan i
            fallande skala. De kommuner som har ökat sina utsläpp får upp till 2
            minuspoäng. I detta nyckeltal inkluderas industrin för att påvisa
            ökningar eller minskningar.
          </li>
        </ol>

        <h4>Industrin utsläpp – exkluderas i två av fyra nyckeltal</h4>

        <p>
          Industrins utsläpp räknas inte med i nyckeltal 1 och 2 som avser
          kommunens totalutsläpp per capita. Det beror på att dessa två
          nyckeltal jämför de olika kommunerna med varandra. En jämförelse som
          inkluderar industrins utsläpp upplevs här som orättvis eller
          missvisande eftersom kommunen har liten rådighet över dessa utsläpp,
          samtidigt som de kan komma att ha ett mycket stort genomslag på de
          sammanlagda utsläppen i den enskilda kommunen. Industrins utsläpp
          regleras också på överstatlig nivå idag (EUs system för handel med
          utsläppsrätter, EU-ETS) och kan betraktas som en nationell, snarare än
          lokal, angelägenhet.
        </p>

        <p>
          I de två nyckeltal som avser den egna förändringstakten (nyckeltal 3
          och 4) sker inte en jämförelse mellan kommunerna. Istället jämför vi
          kommunen med sig själv (hur stora utsläppsförändringar har skett över
          fem år inom kommunen). Här påverkar inte fördelningen av större
          industrtianläggningar över landet eller dessas inverkan på kommunens
          totalutsläpp, poängen. Därför låter vi industrins utsläpp ingå i dessa
          två nyckeltal.
        </p>

        <h4>Utrikes transporter – ingår ej</h4>

        <p>
          Utrikes transporter är en sektor i den nationella emissionsdatabasen.
          Vi har exkluderat denna sektor från samtliga fyra nyckeltal i enlighet
          med Naturvårdsverkets och SMEDs rekommendationer. I Metod- och
          kvalitetsbeskrivning för geografiskt fördelade emissioner till luft
          (submission 2019) står bland annat:
        </p>

        <p>
          ”För utsläpp av växthusgaser från denna sektor (utrikes transporter,
          vår anm.) rekommenderas att dessa endast studeras på nationell nivå.”
        </p>

        <p>
          För mer information om dessa rekommendationer
          <a
            href="https://naturvardsverket.diva-portal.org/smash/get/diva2:1330910/FULLTEXT01.pdf"
          >
            se sid. 98 i Metod- och kvalitetsbeskrivning för geografiskt
            fördelade emissioner till luft (submission 2019).
          </a>
        </p>

        <h5>Nyckeltal 1 – Utsläpp växthusgaser totalt (0 – 2 poäng)</h5>
        <p>
          Här bedöms de genomsnittliga utsläppen av koldioxidekvivalenter de
          senaste fem mätperioderna – per invånare (per capita). Per
          capita-uträkningen har skett för varje år separat och med hjälp av
          kommunal befolkningsstatistik från SCB.
        </p>

        <p>
          Kommunen med lägst utsläpp per person får här 2 poäng. Kommun med
          utsläpp om 25 ton per person eller mer får 0 poäng. Utsläpp på över 25
          ton per person och år räknas alltså som 25 ton. Denna gräns är införd
          eftersom det finns en liten grupp extremutsläppare som annars får en
          orimlig inverkan på poängspektrat. Utan denna gräns får det stora
          flertalet kommuner mycket snarlika poäng, trots att det föreligger
          väsentliga skillnader i deras utsläpp.
        </p>

        <h5>Nyckeltal 2 – Utsläpp koldioxid totalt (0 – 2 poäng)</h5>
        <p>
          Data och poäng beräknas på samma sätt som för Utsläpp växthusgaset
          totalt (ovan), men tar enbart hänsyn till koldioxid (CO2), och inga
          andra växthusgaser.
        </p>

        <h5>Nyckeltal 3 – Förändringstakt utsläpp totalt (−2 – 3 poäng)</h5>
        <p>
          Här bedöms hur utsläppen förändrats mellan mätperiodens första (2013)
          och sista (2017) år. Siffran som bedöms och rankas är den årliga
          förändringstakten (year-on-year) för hela mätperioden. Kommun med bäst
          resultat (störst utsläppsminkningstakt) får 3 poäng. Kommun med sämst
          resultat (störst utsläppsökningstakt) får -2 poäng.
        </p>

        <h5>Nyckeltal 4 – Förändringstakt utsläpp koldioxid (−2 – 3 poäng)</h5>
        <p>
          Data och poäng beräknas på samma sätt som för ”Förändringstakt utsläpp
          totalt” (ovan), men tar enbart hänsyn till koldioxid (CO2), och inga
          andra växthusgaser.
        </p>

        <h4>Mer om poängsättningen av nyckeltal 3 och 4</h4>
        <p>
          Det stora flertalet kommuner minskar sina utsläpp, men det finns ett
          litet antal kommuner där utsläppen istället ökar. Därför talar vi om
          förändringstakt istället för minskningstakt. Här har vi konstaterat
          att det är orimligt att ökande utsläpp ger poäng. Därför har vi infört
          en möjlighet att få minuspoäng – något som bara ett fåtal kommuner
          drabbas av.
        </p>

        <p>
          Bland detta fåtal kommer finns några som avviker väldigt mycket från
          genomsnittskommunen genom att öka sina utsläpp avsevärt. Deras mycket
          avvikande förändringstakt innebär samtidigt att det samlade spektra vi
          har att ta hänsyn till (från den kommun som minskar sin utsläpp
          snabbast till den kommun som istället ökar dem snabbast) breddas. Om
          vi vid poängsättningen tillämpar en linjär exponent får därmed ett
          fåtal kommuner oproportionerligt stort inflytande på poängsättningen.
          I praktiken pressas då det stora flertalet kommuner samman och får
          likartade poäng. Här blir det relevant att koncentrera sig på
          flertalet och upprätta en poängexponent som faktiskt värderar de
          skillnader som föreligger mellan dessa. En s-formad exponent
          (poängkurva) är en konventionell metod för att ta denna typ av hänsyn
          och ranka denna typ av dataunderlag. S-kurvan kan sägas dra ut
          mittfältet.
        </p>

        <img src="../assets/s-kurva_bild.jpg" alt="Bild som visar s-kurva" />

        <p class="image-description">
          Här syns den s-formade exponent (poängkurva) som vi tillämpat. De
          verkliga datapunkterna (kommunerna) för nyckeltalet Förändringstakt
          utsläpp totalt är inprickade i denna bild.
        </p>
      </div>
    </div>

    <button
      class="modal-close is-large"
      aria-label="close"
      @click="$emit('close')"
    ></button>
  </div>
</template>

<script>
const root_el = document.documentElement;
const no_scroll_class = "is-clipped";

export default {
  name: "DialogContent",
  props: ["is_open"],
  watch: {
    is_open(open) {
      if (open) {
        root_el.classList.add(no_scroll_class);
      } else {
        root_el.classList.remove(no_scroll_class);
      }
    },
  },
};
</script>

<style scoped>
.box {
  max-height: 100%;
  overflow-y: scroll;
}

.image-description {
  font-style: italic;
  color: #565656;
  font-size: 14px;
}
</style>
