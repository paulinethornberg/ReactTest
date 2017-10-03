import React, { Component } from 'react';
import OrganisationStore from '../Stores/Organisation';
import RichTextElement from '../Components/RichTextElement';
import dateFormat from 'dateformat';

let getState = (props) => {
  return {
    organisation: OrganisationStore.getOrganisation(props.params.organisationSlug)
  };
};

class Organisation extends Component {

  constructor(props) {
    super(props);

    this.state = getState(props);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    OrganisationStore.addChangeListener(this.onChange);
    OrganisationStore.provideArticle(this.props.params.articleSlug);
  }

  componentWillUnmount() {
    OrganisationStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState(getState(this.props));
  }

  render() {
    let organisation = this.state.organisation;

    if (!organisation) {
      return (
        <div className="container"></div>
      );
    }

    let formatDate = (value) => {
      return dateFormat(value, "dddd, mmmm d, yyyy");
    };

    // let title = article.title.value;
    // let imageLink = article.teaserImage.value[0].url;
    // let postDate = formatDate(article.postDate.value);
    // let bodyCopyElement = article.bodyCopy;

    let title = organisation.name.value;
    let imageLink = 'linklink';
    // let postDate = 'dateFormat';
    let bodyCopyElement = 'bodyelement';


    return (
      <div className="container">
        <article className="article-detail col-lg-9 col-md-12 article-detail-related-box">
          <h2>{title}</h2>
          <div className="article-detail-datetime">
            {title}
          </div>
          <div className="row">
            <div className="article-detail-image col-md-push-2 col-md-8">
              <img alt={title} className="img-responsive" src={imageLink} title={title} />
            </div>
          </div>
          <div className="row">
            <RichTextElement className="article-detail-content" element={bodyCopyElement} />
          </div>
        </article>
      </div>
    );
  }
}

export default Organisation;