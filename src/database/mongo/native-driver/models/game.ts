import { ObjectId } from "mongodb";

/**
 * Game model/document.
 * Rappresenta il gioco in un database MongoDB e setta "id" come opzionale perchè in fase di creazione non è ancora presente e verrà autogenerato da MongoDB.
 * Tutti i documenti in MongoDB hanno un campo "_id" che funge da identificatore univoco.
 *
 * Aggiunta del campo companyId per rappresentare la relazione con il documento Company.
 */
export default class Game {
  constructor(public name: string, public price: number, public category: string, public companyId: ObjectId, public id?: ObjectId) {}
}
