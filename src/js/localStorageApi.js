import { v4 as uuidv4 } from 'uuid';

console.log('local storage api');

/**
 * -Todo-Klasse mit diversen Attributen
 *
 * zum Erstellen einer Instanz -> "let todo = new Todo(<listName>, <description>)"
 *  -> dafür kann die Funktion 'createTodo(<listName>, <description>) verwendet werden! (siehe unten)
 */
class Todo {
  constructor(
    id,
    listName,
    description,
    order = 1,
    dateCreation = new Date(),
    isCompleted = false,
    dateCompletion = null,
    isImportant = false
  ) {
    this.id = id;
    this.listName = listName;
    this.description = description;
    this.order = order;
    this.dateCreation = dateCreation;
    this.isCompleted = isCompleted;
    this.dateCompletion = dateCompletion;
    this.isImportant = isImportant;
  }

  /**
   * in LocalStorage wird JSon gespeichert -> muss beim Auslesen wieder in Todo-Objekte gewandelt werden
   *
   * Dates muessen leider auch neu erzeugt werden (dateCreation and dateCompletion)
   *
   * @param {} json
   * @returns
   */
  static from(json) {
    const todo = Object.assign(new Todo(), json);
    todo.dateCreation = new Date(todo.dateCreation);
    todo.dateCompletion = todo.dateCompletion
      ? new Date(todo.dateCompletion)
      : todo.dateCompletion;
    // console.log(todo);
    return todo;
  }

  /**
   * in LocalStorage wird JSon gespeichert -> muss beim Auslesen wieder in Todo-Objekte gewandelt werden
   *
   * Dates muessen leider auch neu erzeugt werden (dateCreation and dateCompletion)
   *
   * @param {} data
   * @returns
   */
  static fromData(data) {
    // destructure (aka remove unwanted attributes)
    const {
      id,
      listName,
      description,
      order,
      dateCreation,
      isCompleted,
      dateCompletion,
      isImportant,
    } = data;
    // new Instance
    const todo = new Todo(
      id,
      listName,
      description,
      order,
      dateCreation,
      isCompleted,
      dateCompletion,
      isImportant
    );
    // console.table(todo);
    // return
    return todo;
  }

  completed() {
    this.isCompleted = true;
    this.dateCompletion = new Date();
  }

  // todo uncompleted-function erstellen
  uncompleted() {
    // ... code
    this.isCompleted = false;
    this.dateCompletion = null;
  }
}

class TodoListApi {
  constructor() {
    // key der Todolist im LocalStorage
    this.localStorageKey = 'todoList';

    // ###############################
    // -> Haupt-TodoList-Array mit 'Todo'-Class-Objekten; wird in localStorage gespeichert
    this.globalTodoList = this.getTodoListFromStorage();

    // wenn leer -> standard-todos reinsetzen
    if (this.globalTodoList.length === 0) {
      this.addTodo(this.createTodo('haushalt', 'Wäsche'));
      this.addTodo(this.createTodo('haushalt', 'Putzen'));
      this.addTodo(this.createTodo('haushalt', 'Fegen'));
      this.addTodo(this.createTodo('haushalt', 'Hausordnung'));
      this.addTodo(this.createTodo('haushalt', 'Keller'));
      this.addTodo(this.createTodo('haushalt', 'Speicher'));
      this.addTodo(this.createTodo('einkauf', 'Eier'));
      this.addTodo(this.createTodo('einkauf', 'Milch'));
      this.addTodo(this.createTodo('einkauf', 'Mehl'));
      this.addTodo(this.createTodo('einkauf', 'Zucker'));
      this.addTodo(this.createTodo('einkauf', 'Nudeln'));
      this.addTodo(this.createTodo('einkauf', 'Eis'));
      // -todo-list im Storage speichern
      this.saveToLocalStorage(this.globalTodoList);
    }
    // else {
    //   // von Json to Todo-Class konvertieren
    //   this.globalTodoList = this.globalTodoList.map(jsonTodo => Todo.from(jsonTodo))
    // }

    console.table(this.globalTodoList);
    // console.log(getTodo(6).dateCreation.toLocaleString())

    // ################## INIT ENDE
    // ############################
  }

  // #####################################
  // LOCAL STORAGE FUNCTIONS

  /**
   * Daten aus der LocalStorage holen
   * @returns todo-list
   */
  getTodoListFromStorage() {
    let todos = [];

    if (window.localStorage.getItem(this.localStorageKey)) {
      // ! Vorsicht: ist JSON-Data, muss noch in Todo-Objekte gewandelt werden (siehe Init unten)
      todos = JSON.parse(window.localStorage.getItem(this.localStorageKey));
      // von Json to Todo-Class konvertieren
      todos = todos.map((jsonTodo) => Todo.from(jsonTodo));
    }

    return todos;
  }

  /**
   * Daten in die LocalStorage speichern
   * @param {*} todoList
   */
  saveToLocalStorage(todoList) {
    // pseudo-Attribute wieder entfernen (an attempt)
    const todos = todoList.map((todo) => Todo.fromData(todo));
    // console.table(todos);
    window.localStorage.setItem(this.localStorageKey, JSON.stringify(todos));

    this.globalTodoList = todos;
    // console.table(todoList);
  }

  // ! Vorsicht! todolist aus LocalStorage entfernen
  removeTodoList = () => {
    window.localStorage.removeItem(this.localStorageKey);

    this.globalTodoList.length = 0;
  };

  clearLocalStorageATTENTION = () => window.localStorage.clear();

  // #####################################
  // -TODO FUNCTIONS (Hauptpart)

  /**
   * ein Todo holen
   *
   * returned ein Objekt der Klasse 'Todo'
   *
   * @param {*} id des Todo's
   */
  getTodo(id) {
    return this.globalTodoList.find((todo) => todo.id === id);
  }

  /**
   * -> Todo-Eintrag hinzufügen
   *
   * erwartet ein Objekt der Klasse 'Todo' -> siehe Funktion 'createTodo(<listName>, <description>)'
   */
  addTodo(todo) {
    // -todo der Liste hinzufuegen
    this.globalTodoList.push(todo);
    // console.table(this.globalTodoList);

    // im Storage speichern
    this.saveToLocalStorage(this.globalTodoList);
  }

  /**
   * -> Todo-Eintrag aendern
   *
   * erwartet ein Objekt der Klasse 'Todo' (mit 'id')
   */
  editTodo(todo) {
    let idxTodo = -1;

    if (!todo.id) {
      console.error('editTodo >> todo ohne ID!');
      return; // Abbruch
    }

    idxTodo = this.globalTodoList.indexOf(this.getTodo(todo.id));

    // const todoStorage = this.globalTodoList.find((todoStorage, idx) => {
    //   if(todoStorage.id === todo.id) {
    //     idxTodo =  idx
    //     return true
    //   }
    // })
    console.log(`idxTodo: ${idxTodo}`);
    this.globalTodoList[idxTodo] = todo; // todo wird evtl nicht benoetigt, da gepointert

    // -todo-list im Storage speichern
    this.saveToLocalStorage(this.globalTodoList);
  }

  /**
   * ein Todo umbenennen
   *
   * @param {*} id des Todo's
   */
  renameTodo(id, description) {
    const todo = this.getTodo(id);

    if (!todo) {
      // error -> nicht gefunden
      console.error('Todo nicht gefunden!');
      return false;
    }

    // siehe Class Todo
    todo.description = description;

    // in localStorage speichern
    this.saveToLocalStorage(this.globalTodoList);
  }

  /**
   * ein Todo entfernen
   *
   * @param {*} id des Todo's
   */
  removeTodo(id) {
    // filter-Array ohne dem Todo mit der uebergebenen 'id'
    this.globalTodoList = this.globalTodoList.filter((todo) => todo.id !== id);

    //    -> dieses Array dann in localStorage speichern
    this.saveToLocalStorage(this.globalTodoList);
  }

  /**
   * ein Todo 'erledigen'
   *
   * @param {*} id des Todo's
   */
  checkTodo(id) {
    const todo = this.getTodo(id);

    if (!todo) {
      // error -> nicht gefunden
      console.error('Todo nicht gefunden!');
      return false;
    }

    if (todo.isCompleted) {
      // siehe Class Todo
      this.uncompleteTodo(todo);
    } else {
      this.completeTodo(todo);
    }
  }

  /**
   * ein Todo 'erledigen'
   *
   * @param {*} id des Todo's
   */
  completeTodo(todo) {
    // const todo = this.getTodo(id);

    // siehe Class Todo
    todo.completed();

    // in localStorage speichern
    this.saveToLocalStorage(this.globalTodoList);
  }

  /**
   * ein 'erledigtes' Todo wieder zuruecksetzen
   *
   * @param {*} id des Todo's
   */
  uncompleteTodo(todo) {
    // todo tbf...
    // const todo = this.getTodo(id);

    // siehe Class Todo
    todo.uncompleted();

    // in localStorage speichern
    this.saveToLocalStorage(this.globalTodoList);
  }

  /**
   * Neues Todo-Objekt generieren -> wird in localStorage TodoListe (ein Array) eingefuegt
   *
   * @param {*} listName
   * @param {*} description
   * @param {*} order
   * @param {*} dateCreation
   * @param {*} isCompleted
   * @param {*} dateCompletion
   * @param {*} isImportant
   * @returns
   */
  createTodo(
    listName,
    description,
    order = 1,
    dateCreation = new Date(),
    isCompleted = false,
    dateCompletion = null,
    isImportant = false
  ) {
    // jetzt über 'uuid'
    const newId = uuidv4();
    // const maxId = this.getMaxId(this.globalTodoList);

    // todo max order noch setzen

    const todo = new Todo(
      newId,
      listName,
      description,
      order,
      dateCreation,
      isCompleted,
      dateCompletion,
      isImportant
    );

    return todo;
  }

  /**
   * Max-Id der Todo-List ermitteln (fuer neues Todo)
   *
   * @returns maxId
   */
  getMaxId(todoList) {
    if (todoList.length === 0) {
      return 1;
    }

    const maxId = Math.max(...todoList.map((todo) => todo.id)) + 1;
    console.log(`maxId: ${maxId}`);
    return maxId;
  }

  // #####################################
  // LIST FUNCTIONS (Hauptpart)

  /**
   * Erstellt eine neue Liste (z.B. Shopping)
   *  -> enstpricht einem Todo-Pseudo-Eintrag
   *
   * @param {*} listName Name der Liste
   * @returns ein Pseudo-Todo mit Bezeichnung 'Neuer Eintag'
   *
   */
  addList(listName) {
    // falls Liste schon vorhanden 'null' returnen (kann auf falsy geprueft werden)
    if (this.getList(listName).length > 0) {
      console.error('Liste schon vorhanden!');
      // alert('Liste schon vorhanden!');
      return false;
    }

    // einen Pseudo-Eintrag in die Todoliste machen
    let pseudoTodo = this.createTodo(listName, 'Neuer Eintrag');
    // in localStorage speichern
    this.addTodo(pseudoTodo);

    console.log(pseudoTodo); // Typ von Class Todo (mit allen Attributen)

    return pseudoTodo;
  }
  /**
   * Liste umbenennen -> alle Todos der Liste mit neuen 'listName' updaten
   * @param {*} oldListName
   * @param {*} newListName
   */
  renameList(oldListName, newListName) {
    console.log(`oldListName: ${oldListName} -  newListName: ${newListName}`);
    const newTodolist = this.globalTodoList.map((todo) => {
      if (todo.listName === oldListName) todo.listName = newListName;
      return todo;
    });

    this.saveToLocalStorage(newTodolist);
  }

  /**
   * ALLE Todo-Listen holen (->sidebar-list!)
   *    -> Anzahl an Todos pro Typ wird mitgeliefert
   * 
   * todo Sortierung?
   * 
   * return -> example
        listName    count
        'homework'  1
        'shopping'	5
   */
  getAllLists() {
    console.log('getAllLists');
    // nur die Listen-(Namen) auflisten
    const listNames = this.getTodoListFromStorage().map(
      (todo) => todo.listName
    );
    // Duplicate entfernen
    let uniqueListNames = [...new Set(listNames)];

    // objekte mit Anzahl an Todos pro Liste(n-Name) zurueckgeben
    uniqueListNames = uniqueListNames.map((listName) => {
      // Objekt kreieren -> Listenname + Anzahl an todo's pro Liste (siehe console.table-Output)
      return {
        listName: listName,
        count: listNames.reduce(
          (acc, curr) => acc + (curr === listName ? 1 : 0),
          0
        ),
      };
    });

    console.table(uniqueListNames);

    return uniqueListNames;
  }

  /**
   * EINE Liste mit allen Todo's abfragen
   *
   * @param {*} listName Name der Todo-Liste *
   * @return liefert alle Todo's der Liste
   */
  getList(listName) {
    console.log(`listName: ${listName}`);

    const getTodosOfList = (isCompleted) =>
      this.getTodoListFromStorage()
        .filter((todo) => {
          todo.isFirstCompleted = false; // pseudo-value
          return todo.listName === listName && todo.isCompleted === isCompleted;
        })
        .sort((prev, curr) => {
          // nach 'order' sortieren, wenn gleiche 'order' -> dann nach dateCreation sortieren
          if (prev.order !== curr.order) {
            return prev.order - curr.order;
          } else {
            // console.log(`isCompleted: ${isCompleted}`);
            if (!isCompleted) return prev.dateCreation - curr.dateCreation;
            else return curr.dateCompletion - prev.dateCompletion;
          }
        });

    // erst unfertige Todo's, dann fertige
    let todosOfList = getTodosOfList(false);
    const listCompleted = getTodosOfList(true);
    if (listCompleted.length) listCompleted[0].isFirstCompleted = true; // pseudo-value zum Anzeigen der 'dotted line' über dem ersten 'completed todo'

    // listen zusammenfuegen
    todosOfList = todosOfList.concat(listCompleted);

    // console.table(todosOfList);

    return todosOfList;
  }
}

function Test() {
  /**
   * Instanz der Api -> mit diesem alle Funktionen aufrufen!
   *
   *  z.B. _api.getList('shopping')
   */
  const _api = new TodoListApi();

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // #############################
  // ################## TESTS

  /**
   * test funktion, um Todo hinzuzufuegen
   */
  function testAddRandomTodo() {
    const todo = _api.createTodo(
      'shopping',
      'Produkt ' + Math.floor(Math.random() * 1000)
    );
    console.table(todo);
    _api.addTodo(todo);
  }

  function testGetTodoListFromStorage() {
    console.table(_api.getTodoListFromStorage());
  }

  // #############################
  // ################## Beispiel Implementierungen der TodoList-Api

  /**
   * alle Listen holen und ausgeben
   */
  function testGetAllLists() {
    _api.getAllLists().forEach((list) => {
      console.log(`listName: ${list.listName}`);
      console.log(`anzahl todos: ${list.count}`);

      // your code: here for example build html-code to add to your nav-bar
      // let navListElement = createNavListElement(list.listName, list.count)
      // document.getElementById('navbar').appendChild(navListElement)
    });
  }

  /**
   * alle Todo's einer Liste holen und ausgeben
   */
  function testGetListTodos() {
    // Liste 'shopping' holen
    const todos = _api.getList('shopping');

    // ueber todos iterieren
    todos.forEach((todo) => {
      console.log(`\n ---Todo >> id: ${todo.id}`);
      console.log(`beschreibung: ${todo.description}`);
      console.log(`erstellt am: ${todo.dateCreation.toLocaleString()}`);

      // your code: here for example build html-code to add to your <main> section (o.ä.)
      // let todoDivElement = createTodoDivElement(todo.id, todo.description, todo.dateCreation ...) // oder nur "todo" als parameter uebergeben
      // document.getElementById('main').appendChild(todoDivElement)
    });
  }

  /**
   * eine neue Liste hinzufügen
   */
  function testAddNewList() {
    const todo = _api.addList('shopping');

    if (!todo) {
      // error -> Listenname schon vergeben
    } else {
      console.log(`\n ---Todo >> id: ${todo.id}`);
      console.log(`beschreibung: ${todo.description}`); // Pseudo-Eintrag -> 'Neuer Eintrag'
      console.log(`erstellt am: ${todo.dateCreation.toLocaleString()}`);
    }
  }

  /**
   * ein Todo mit 'id' holen
   */
  function testGetTodo() {
    const todoId = 7;
    // wird ueber id geholt
    const todo = _api.getTodo(todoId);

    if (!todo) {
      // error -> nicht gefunden
      console.error('Todo nicht gefunden!');
    } else {
      console.log(`\n ---Todo >> id: ${todo.id}`);
      console.log(`beschreibung: ${todo.description}`);
      console.log(`erstellt am: ${todo.dateCreation.toLocaleString()}`);
      console.log(`erledigt?: ${todo.isCompleted}`);
    }
  }

  /**
   * ein neues Todo generieren
   */
  function testCreateTodo() {
    const listName = 'shopping';
    const description = 'Meine Todo-Beschreibung';

    // let newTodo = createTodo(listName, description)

    // oder aber auch mit zusätzlichen Parametern, z.B. Reihenfolge
    const order = 3;
    let newTodo = _api.createTodo(listName, description, order);

    console.log(`\n ---Todo >> id: ${newTodo.id}`);
    console.log(`beschreibung: ${newTodo.description}`);
    console.log(`erstellt am: ${newTodo.dateCreation.toLocaleString()}`);

    // zum Speichern in localStorge die 'addTodo'-Funktion aufrufen
    _api.addTodo(newTodo);
  }
}

export { Todo, TodoListApi, Test };
