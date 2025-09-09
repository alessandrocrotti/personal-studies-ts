# Food Diary Architecture

- [Food Diary Architecture](#food-diary-architecture)
  - [Descrizione](#descrizione)
  - [Specifiche del progetto](#specifiche-del-progetto)

## Descrizione

Questo readme ha il solo scopo di progettare su carta una applicazione applicando i principi del Domain Driven Design e altri principi descritti nella sezione Architecture. Non è necessario implementare le scelte fatte, quanto è necessario pensare alle soluzioni tecniche coinvolte.

## Specifiche del progetto

Il progetto ha lo scopo di creare una applicazione che possa gestire il diario alimentare di un utente. Lo scopo è creare quindi il backend e la business logic alla base dell'applicazione. Tramite un'altra applicazione di frontend, verrà create l'interfaccia che mette a disposizione la logica di backend all'utente finale, interfacciandosi con tutti i componenti della business logic.

Qui elenchiamo diverse funzionalità che ci aspettiamo possa fare la nostra applicazione:

- Ogni utente ha un account
  - Gli utenti possono avere l'account type User / Nutritionist
    - Lo User ha accesso solo ai suoi dati personali e può
      - modificare il suo Diary
      - selezionare/creare un Diet
      - aggiungere dei Food
    - Il Nutritionist ha accesso ai dati dei suoi pazienti che sono gli User che hanno accettato di essere pazienti di un Nutritionist e può
      - creare una Diet per uno User e selezionarla per lui
      - creare delle note sul Diary
      - aggiungere dei Food
- Il Food è un cibo particolare con le sue caratteristiche
  - Ha una tabella nutrizionale (calorie e macronutrienti) basata su una certa BaseQuantity
  - Ha una BaseQuantity (100g, 100ml) usata per rapportare la tabella nutrizionale
  - Ha un utente Creator che può essere Nutritionist, User, o nessuno. Nel caso non sia definito, si tratta di alimenti base dell'applicazione
  - Uno User può vedere tutti gli alimenti dove il Creator non è definito o dove il Creator è lui o dove il Creator è il suo Nutritionist
  - Un Nutritionist può vedere tutti gli alimenti dove il Creator non è definito o dove il Creator è lui o dove il Creator è un suo User
  - Uno User può modificare solo gli alimenti che ha creato lui stesso
  - Un Nutritionist può modificare solo gli alimenti che ha creato lui stesso o un suo User
- La Diet è il componente che definisce la tabella nutrizionale adatta per te
  - Il Nutritionist o lo User possono creare un MealType, creare qui un MealType lo crea anche nel Diary
  - Avrà una proposta di tabella nutrizionale per DiaryPage (per la fine della giornata quante calorie e macronutrienti devi aver assunto) e per MealType
  - Avrà varie proposte di Meal con i relativi MealRow e tabella nutrizionale calcolata dai relativi Food
  - Avrà una lista di ProposalMealRow con una ProposalMealRowCategory e associate ad un MealType, da cui uno User può scegliere e comporre il proprio Meal. Per gestire una dieta a lista di scambio
  - Avrà una funzione di calcolo di un Meal bilanciato rispetto ad una certa tabella nutrizionale: provo a comporre il mio Meal con delle MealRow che hanno certe Quantity e vedo il risultato rispetto ai limiti del Meal che dovrei fare. Utile per personalizzarsi la dieta e
  - Avrà una descrizione con le linee guida da seguire
  - Esisteranno delle Diet preconfigurate senza alcun Creator e delle Diet con Nutritionist come Creator
  - User e Nutritionist possono vedere tutte le diete senza alcun Creator o con il Nutritionist come Creator
- Il Diary è un componente complesso che registra i pasti, le calorie e i macronutrienti assunti giorno per giorno man mano che lo User li registra
  - Uno User può avere più Diary (anche se di norma dovrebbe averne logicamente uno) ed uno di default
  - Il Diary può avere delle DiaryPage che rappresentano un giorno, quindi avranno una data
  - Ogni DiaryPage può avere dei Meal che rappresentano i pasti della giornata, quindi avranno un MealType (colazione, pranzo, cena, spuntino, pasto libero...)
  - lo User possono creare un MealType, creare qui un MealType lo crea anche nel Diet
  - Ogni Meal avrà delle MealRow che rappresentano un Food e una Quantity
  - Avendo il Food e la Quantity di ogni MealRow, posso ricostruire la tabella nutrizionale (calorie e macronutrienti) dal rapporto con la BaseQuantity del Food per ogni MealRow
  - Avendo la tabella nutrizionale per ogni MealRow, posso sommarle per avere quindi la tabella nutrizionale di ogni Meal e quindi della DiaryPage
  - Se ho selezionato una Diet, posso avere degli "alert" riguardo a quanto sono vicino o lontano dagli obiettivi della proposta di tabella nutrizionale nel mio DiaryPage e per MealType
  - Se ho selezionato una Diet, posso dalla Diet aggiungere una o più ProposalMealRow (i pasti consigliati li faccio esattamente come sono e quindi li aggiungo tali e quali)
  - Il Nutritionist può scrivere commenti su DiaryPage, Meal, MealRow
