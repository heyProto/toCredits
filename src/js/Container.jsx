import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class toCreditsCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      optionalConfigJSON: {}
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
    }
    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }
    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
  }

  componentDidMount() {
    if (this.state.fetchingData){
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];
      axios.all(items_to_fetch).then(axios.spread((card) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: {
            card_data: card.data
          },
          optionalConfigJSON: {}
        };
        this.setState(stateVar);
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  groupBy(data, column) {
    let grouped_data = {},
      key;
    switch (typeof column) {
      case "string":
        data.forEach(datum => {
          key = datum[column] ? datum[column] : "Not available";
          if (grouped_data[key]) {
            grouped_data[key].push(datum);
          } else {
            grouped_data[key] = [datum];
          }
        });
        break;
      case "function":
        data.forEach(datum => {
          let key = column(datum);
          if (grouped_data[key]) {
            grouped_data[key].push(datum);
          } else {
            grouped_data[key] = [datum];
          }
        });
        break;
    }
    return grouped_data;
  }

  renderSixteenCol(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      let data = this.state.dataJSON.card_data.data,
        grouped_data = this.groupBy(data.section, "title"),
        arr = [1],
        section = [];
      for (let key in grouped_data){
        let names = grouped_data[key].map((d,i) =>{
          return(
            <div style={{display: 'inline-block'}}>
              <a href={d.url} target="_blank">
                <div className="company-name">{d.name}</div>
                <div className="company-logo"><img src={d.logo}/></div>
              </a>
            </div>
          )
        })
        section = section.concat(arr.map((d,i) =>{
          return(
            <div className="credit-section">
              <div className="section-title">{key}</div>
              {names}
            </div>
          )
        }))
      }
      return(
        <div className="credits-card">
          <div className="credit-logos">
            <div className="scroll-area">{section}</div>
          </div>
        </div>
      )
    }
  }

  renderFourCol(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      let data = this.state.dataJSON.card_data.data,
        grouped_data = this.groupBy(data.section, "title"),
        arr = [1],
        section = [];
      for (let key in grouped_data){
        let names = grouped_data[key].map((d,i) =>{
          return(
            <div>
              <a href={d.url} target="_blank">
                <div className="company-name">{d.name}</div>
                <div className="company-logo"><img src={d.logo}/></div>
              </a>
            </div>
          )
        })
        section = section.concat(arr.map((d,i) =>{
          return(
            <div className="credit-section">
              <div className="section-title">{key}</div>
              {names}
            </div>
          )
        }))
      }
      return(
        <div className="credits-card-mobile">
          <div className="credit-logos">
            <div className="scroll-area">{section}</div>
          </div>
        </div>
      )
    }
  }
  render() {    
    switch(this.props.mode) {
      case 'col16':
        return this.renderSixteenCol();
      case 'col4':
        return this.renderFourCol();
    }
  }
}

// <div className="fog-effect-left"></div>
// <div className="fog-effect-right"></div>