import Client from "../Client.js";

let changeListeners = [];
let organisations = [];
let organisationDetails = {};
let organisationListCapacity = 0;
let locations = [];
let categories = [];

let notifyChange = () => {
  changeListeners.forEach((listener) => {
    listener();
  });
}
// let fetchOrganisations = () => {

//   // Client.items()
//   //   .type('organisation')
//   //   .orderParameter('elements.name')
//   //   .get()
//   //   .subscribe(response => {
//   //     organisations = response.items;
//   //     notifyChange();
//   //   });
//    Client.items()
//       .type('organisation')
//       .equalsFilter('elements.slug', organisationSlug)  
//       .elementsParameter(['name', 'description'])
//       .get()
//       .subscribe(response => {
//         if (!response.isEmpty) {
//           organisationDetails[organisationSlug] = response.items[0];
//           notifyChange();
//         }
//       })

// }

let fetchLocations = () => {
  Client.taxonomy("location")
    .get()
    .subscribe(response => {
      locations = response.terms;
      notifyChange();
    });
};

let fetchCategories = () => {
  Client.taxonomy("category")
    .get()
    .subscribe(response => {
      categories = response.terms;
      notifyChange();
    });
}

export class Filter {
  constructor() {
    this.locations = [];
    this.categories = [];
  }

  matches(organisation) {
    return this.matchesLocations(organisation) && this.matchesCategories(organisation);
  }

  matchesLocations(organisation) {
    if (this.locations.length === 0) {
      return true;
    }

    let locations = organisation.location.value.map(x => x.codename);

    return this.locations.some(x => locations.includes(x));
  }

  matchesCategories(organisation) {
    if (this.categories.length === 0) {
      return true;
    }

    let statuses = organisation.category.value.map(x => x.codename);

    return this.categories.some(x => statuses.includes(x));
  }

  toggleLocation(location) {
    let index = this.locations.indexOf(location);

    if (index < 0) this.locations.push(location); else this.locations.splice(index, 1);
  }

  toggleCategory(category) {
    let index = this.categories.indexOf(status);

    if (index < 0) this.categories.push(category); else this.categories.splice(index, 1);
  }
}

let organisationFilter = new Filter();

class OrganisatioWFilterStore {

  // Actions

   provideOrganisation(organisationSlug) {

    Client.items()
      .type('organisation')
      .equalsFilter('elements.slug', organisationSlug)  
      .elementsParameter(['name', 'description'])
      .get()
      .subscribe(response => {
        if (!response.isEmpty) {
          organisationDetails[organisationSlug] = response.items[0];
          notifyChange();
        }
      })
  }
  provideOrganisations(count) {
    if (count <= organisationListCapacity) {
      return;
    }

    organisationListCapacity = count;

    Client.items()
      .type('organisation')         
      .get()
      .subscribe(response =>
        {
          organisations = response.items;
          notifyChange();
        });
  }


  provideLocations() {
    fetchLocations();
  }

  provideCategories() {
    fetchCategories();
  }

  // Methods

  getOrganisation(organisationSlug) {
    return organisations.find((organisation) => organisation.slug.value === organisationSlug);
  }

  getOrganisations(count) {
    return organisations.slice(0, count);
  }

  getLocations() {
    return locations;
  }

  getCategories() {
    return categories;
  }

  getFilter() {
    return organisationFilter;
  }

  setFilter(filter) {
    organisationFilter = filter;
    notifyChange();
  }

  // Listeners

  addChangeListener(listener) {
    changeListeners.push(listener);
  }

  removeChangeListener(listener) {
    changeListeners = changeListeners.filter((element) => {
      return element !== listener;
    });
  }

}

export default new OrganisatioWFilterStore();
