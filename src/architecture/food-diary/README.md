# Food Diary Architecture

- [Food Diary Architecture](#food-diary-architecture)
  - [Descrizione](#descrizione)
  - [Specifiche del progetto](#specifiche-del-progetto)
  - [Strategic DDD](#strategic-ddd)
    - [Ubiquitous Language](#ubiquitous-language)
    - [Subdomains e Bounded Contexts](#subdomains-e-bounded-contexts)
      - [User Management Context](#user-management-context)
      - [Food Catalog Context](#food-catalog-context)
      - [Diet Planning Context](#diet-planning-context)
      - [Diary Management Context](#diary-management-context)

## Descrizione

Questo readme ha il solo scopo di progettare su carta una applicazione applicando i principi del Domain Driven Design e altri principi descritti nella sezione Architecture. Non è necessario implementare le scelte fatte, quanto è necessario pensare alle soluzioni tecniche coinvolte.

## Specifiche del progetto

Il progetto ha lo scopo di creare una applicazione che possa gestire il diario alimentare di un utente. Lo scopo è creare quindi il backend e la business logic alla base dell'applicazione. Tramite un'altra applicazione di frontend, verrà create l'interfaccia che mette a disposizione la logica di backend all'utente finale, interfacciandosi con tutti i componenti della business logic.

Qui elenchiamo diverse funzionalità che ci aspettiamo possa fare la nostra applicazione:

- Ogni User ha un account
  - Gli User possono avere l'account type Subject / Nutritionist
    - Il Subject ha accesso solo ai suoi dati personali e può
      - modificare il suo Diary
      - selezionare/creare un Diet
      - aggiungere dei Food
    - Il Nutritionist ha accesso ai dati dei suoi pazienti che sono i Subject che hanno accettato di essere pazienti di un Nutritionist e può
      - creare una Diet per un Subject e selezionarla per lui
      - creare delle note sul Diary
      - aggiungere dei Food
- Il Food è un cibo particolare con le sue caratteristiche
  - Ha una tabella nutrizionale (calorie e macronutrienti) basata su una certa BaseQuantity
  - Ha una BaseQuantity (100g, 100ml) usata per rapportare la tabella nutrizionale
  - Ha uno User Creator che può essere Nutritionist, Subject, o nessuno. Nel caso non sia definito, si tratta di alimenti base dell'applicazione
  - Un Subject può vedere tutti gli alimenti dove il Creator non è definito o dove il Creator è lui o dove il Creator è il suo Nutritionist
  - Un Nutritionist può vedere tutti gli alimenti dove il Creator non è definito o dove il Creator è lui o dove il Creator è un suo Subject
  - Un Subject può modificare solo gli alimenti che ha creato lui stesso
  - Un Nutritionist può modificare solo gli alimenti che ha creato lui stesso o un suo Subject
- La Diet è il componente che definisce la tabella nutrizionale adatta per te
  - Il Nutritionist o il Subject possono creare un MealType, creare qui un MealType lo crea anche nel Diary
  - Avrà una proposta di tabella nutrizionale per DiaryPage (per la fine della giornata quante calorie e macronutrienti devi aver assunto) e per MealType
  - Avrà varie proposte di Meal con i relativi MealRow e tabella nutrizionale calcolata dai relativi Food
  - Avrà una lista di ProposalMealRow con una ProposalMealRowCategory e associate ad un MealType, da cui un Subject può scegliere e comporre il proprio Meal. Per gestire una dieta a lista di scambio
  - Avrà una funzione di calcolo di un Meal bilanciato rispetto ad una certa tabella nutrizionale: provo a comporre il mio Meal con delle MealRow che hanno certe Quantity e vedo il risultato rispetto ai limiti del Meal che dovrei fare. Utile per personalizzarsi la dieta e
  - Avrà una descrizione con le linee guida da seguire
  - Esisteranno delle Diet preconfigurate senza alcun Creator e delle Diet con Nutritionist come Creator
  - Subject e Nutritionist possono vedere tutte le diete senza alcun Creator o con il Nutritionist come Creator
- Il Diary è un componente complesso che registra i pasti, le calorie e i macronutrienti assunti giorno per giorno man mano che il Subject li registra
  - Un Subject può avere più Diary (anche se di norma dovrebbe averne logicamente uno) ed uno di default
  - Il Diary può avere delle DiaryPage che rappresentano un giorno, quindi avranno una data
  - Ogni DiaryPage può avere dei Meal che rappresentano i pasti della giornata, quindi avranno un MealType (colazione, pranzo, cena, spuntino, pasto libero...)
  - I Subject possono creare un MealType, creare qui un MealType lo crea anche nel Diet
  - Ogni Meal avrà delle MealRow che rappresentano un Food e una Quantity
  - Avendo il Food e la Quantity di ogni MealRow, posso ricostruire la tabella nutrizionale (calorie e macronutrienti) dal rapporto con la BaseQuantity del Food per ogni MealRow
  - Avendo la tabella nutrizionale per ogni MealRow, posso sommarle per avere quindi la tabella nutrizionale di ogni Meal e quindi della DiaryPage
  - Se ho selezionato una Diet, posso avere degli "alert" riguardo a quanto sono vicino o lontano dagli obiettivi della proposta di tabella nutrizionale nel mio DiaryPage e per MealType
  - Se ho selezionato una Diet, posso dalla Diet aggiungere una o più ProposalMealRow (i pasti consigliati li faccio esattamente come sono e quindi li aggiungo tali e quali)
  - Il Nutritionist può scrivere commenti su DiaryPage, Meal, MealRow

## Strategic DDD

Questa pianificazione è semplicemente una bozza per mostrare cosa potrebbe essere necessario, ma non è stata implementata. Implementandola si potrebbe notare che manca qualcosa oppure è stato fatto qualcosa di troppo. Per esempio probabilmente gli Domain Event sono per la maggior parte superflui se nessun altro servizio necessita di quell'evento. Sono comunque stati messi per dare una idea delle varie possibilità implementative.

**Repositories**: ogni Bounded Context ha sostanzialmente un singolo repository che gestisce la sua Aggregate Root. È importante capire lo scopo qui dei repository rispetto ai database. Ogni Bounded Context utilizzerà un DB relazionale, visto che ogni oggetto è piuttosto strutturato. Le tabelle create, che possono essere varie, possono essere accedute tramite ORM. Lo scopo dei Repository è quello di creare una interfaccia che mappi gli oggetti a database negli oggetti di dominio (Entity / Value Object). Io potrei avere anche una singola tabella a DB che rappresenta più oggetti di dominio, ma l'implementazione del Repository che lavora via ORM (o SQL Native) dovrà prendere la singola riga generare gli oggetti di dominio che saranno quelli restituiti dai suoi metodi.

Facciamo un esempio con il Food che ha "FoodId", "BaseQuantity", "NutritionalTable", "Creator" che sono dei Value Object o Entity. Quindi l'oggetto Food avrà gli attributi relativi a questi oggetti che a loro volta avranno i loro attributi. A database la riga Food sarà una sola ma nell'applicazione sia avrà un oggetto Food e i sotto oggetti, tipo Food.NutritionalTable.Calories.

### Ubiquitous Language

Qui mettiamo la lista dei termini che diventeranno specifici del nostro progetto. Per comodità e visto che il progetto è ridotto, non saranno suddivisi per singolo Bounded Context, ma gli stessi in tutti. Per chiarezza sono gli stessi termini che sono stati utilizzati nelle [Specifiche del progetto](#specifiche-del-progetto):

- **Account**: Profilo dell'utente con tipo specifico (Subject/Nutritionist)
- **User**: Utente standard che utilizza l'applicazione
- **Subject**: Tipo di utente che utilizza il diario e inserisce i pasti
- **Nutritionist**: Tipo di utente che gestisce le diete di più utenti **Subject** e commenta i loro **Diary**
- **Food**: Alimento con tabella nutrizionale e **BaseQuantity**
- **BaseQuantity**: Quantità di riferimento per la tabella nutrizionale (es. 100g, 100ml)
- **Diet**: Piano alimentare con obiettivi nutrizionali e proposte di pasti
- **ProposalMealRow**: Suggerimento di porzione per la dieta a scambio
- **Diary**: Registro dei pasti consumati
- **DiaryPage**: Rappresenta i pasti di una singola giornata
- **Meal**: Pasto specifico (colazione, pranzo, cena, etc.)
- **MealType**: Categoria di pasto (colazione, pranzo, cena, spuntino, pasto libero)
- **MealRow**: Singolo elemento di un pasto (Food + Quantity)
- **NutritionalTable**: Tabella con calorie e macronutrienti

### Subdomains e Bounded Contexts

Dalle specifiche si possono ricavare i seguenti subdomain e accoppiarli al relativo bounded context per semplicità:

- **Diary Management**: Core Domain
- **Food Catalog**: Supporting Domain
- **Diet Planning**: Supporting Domain
- **User Manaement**: Generic Domain

#### User Management Context

Gestione degli account

- **Entity**:
  - `User` (Aggregate Root)
  - `PatientRelationship` (Entity)
- **Value Objects**:
  - `AccountType`
  - `UserId`
- **Domain Services**:
  - `UserAuthenticationService`
  - `PatientAssignmentService`
- **Domain Events**:
  - `UserRegistered`
  - `PatientAssigned`
  - `PatientUnassigned`
- **Repositories**:
  - `UserRepository`

**User Aggregate**

```
User (Root)
├── UserId
├── AccountType
├── DefaultDiaryId
└── AssignedNutritionistId?
```

#### Food Catalog Context

Gestione del catalogo degli alimenti

- **Entity**:
  - `Food` (Aggregate Root)
  - `NutritionalTable` (Value Object)
  - `BaseQuantity` (Value Object)
- **Value Objects**:
  - `FoodId`
  - `Calories`
  - `Macronutrients`
  - `Creator`
- **Domain Services**:
  - `FoodVisibilityService`
  - `FoodPermissionService`
- **Domain Events**:
  - `FoodCreated`
  - `FoodUpdated`
  - `FoodDeleted`
- **Repositories**:
  - `FoodRepository`
- **Business Rules**:
  - Uno User può vedere: alimenti base + propri + del suo Nutritionist
  - Un Nutritionist può vedere: alimenti base + propri + dei suoi pazienti
  - Modifiche permesse solo al Creator o al Nutritionist del Creator

**Food Aggregate**

```
Food (Root)
├── FoodId
├── Name
├── NutritionalTable
├── BaseQuantity
└── Creator?
```

#### Diet Planning Context

Gestione dei piani alimentari e degli obiettivi nutrizionali

- **Entity**:
  - `Diet` (Aggregate Root)
  - `MealType` (Entity)
  - `ProposalMeal` (Entity)
  - `ProposalMealRow` (Entity)
  - `ProposalMealRowCategory` (Value Object)
- **Value Objects**:
  - `DietId`
  - `NutritionalTarget`
  - `DietDescription`
- **Domain Services**:
  - `MealBalancingService`
  - `NutritionalCalculationService`
  - `DietRecommendationService`
- **Domain Events**
  - `DietCreated`
  - `MealTypeCreated`
  - `DietAssignedToUser`
- **Repositories**:
  - `DietRepository`
- **Business Rules**:
  - Creazione MealType sincronizzata tra Diet e Diary
  - Calcolo automatico delle proposte nutrizionali
  - Bilanciamento automatico dei pasti

**Diet Aggregate**

```
Diet (Root)
├── DietId
├── Creator?
├── Description
├── MealTypes[]
├── NutritionalTargets
├── ProposalMeals[]
└── ProposalMealRows[]
```

#### Diary Management Context

Registrazione e tracciamento dei pasti quotidiani

- **Entity**:
  - `Diary` (Aggregate Root)
  - `DiaryPage` (Entity)
  - `Meal` (Entity)
  - `MealRow` (Entity)
- **Value Objects**:
  - `DiaryId`
  - `Date`
  - `Quantity`
  - `Comment`
- **Domain Services**:
  - `NutritionalTrackingService`
  - `DietComplianceService`
  - `CommentingService`
- **Domain Events**
  - `MealLogged`
  - `DiaryPageCompleted`
  - `CommentAdded`
  - `NutritionalTargetAchieved`
- **Repositories**:
  - `DiaryRepository`
- **Business Rules**:
  - Un User ha un Diary di default
  - Calcolo nutrizionale basato su Food.BaseQuantity
  - Alert di conformità alla Diet selezionata
  - Solo Nutritionist può commentare

**Diary Aggregate**

```
Diary (Root)
├── DiaryId
├── OwnerId
├── SelectedDietId?
├── IsDefault
└── DiaryPages[]
    └── DiaryPage
        ├── Date
        ├── Meals[]
        │   └── Meal
        │       ├── MealType
        │       └── MealRows[]
        │           └── MealRow
        │               ├── FoodId
        │               ├── Quantity
        │               └── Comments[]
        ├── Comments[]
        └── NutritionalSummary
```
