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
      optionalConfigJSON: {},
      image_count: 1
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
    } else {
      this.componentDidUpdate();
    }
  }

  setWidth(){
    console.log(this.state.image_count, this.state.dataJSON.card_data.data.section.length)
    if (this.state.image_count === this.state.dataJSON.card_data.data.section.length){
      let items = document.querySelectorAll('.credits-links'),
        scroll_area = document.querySelector('.scroll-area'),
        section = document.querySelectorAll('.credits-section'),
        section_length = section.length,
        length = items.length,
        width = 0;

      if (scroll_area) {
        for(let i = 0; i < length; i++) {
          width += (items[i].getBoundingClientRect().width + (this.state.renderMode === "col4" ? 10 : 5));
        }
        scroll_area.style.width = `${width + section_length * 30}px`;
      }

      if (scroll_area){
        let window_items = [],
          min = 0,
          max = items.length - 1,
          navBar = document.querySelector('.credits-logos'),
          stateOfNavbar = [],
          navBarBBox = navBar.getBoundingClientRect();

        console.log(max, "max")

        for (let i = 0; i < max; i++) {
          let left = items[i].getBoundingClientRect().left,
            width = items[i].getBoundingClientRect().width;

          if ((left + width) <= navBarBBox.width) {
            window_items.push(i);
          }
        }

        stateOfNavbar.push({
          window_items: window_items,
          scrollLeft: 0
        });

        console.log(stateOfNavbar, "stateOfNavbar")
        document.querySelector('#prev-arrow').addEventListener('click', (e) => {
          console.log("hey prev", stateOfNavbar)
          let popedElement = stateOfNavbar.pop(),
            currentElement = stateOfNavbar[stateOfNavbar.length - 1],
            next = document.querySelector('#next-arrow');

          console.log(currentElement,"currentElement" )
          
          window_items = currentElement.window_items;

          if (next.style.display !== 'inline-block') {
            next.style.display = 'inline-block';
          }

          document.querySelector('.credits-logos').style.overflow = 'scroll';
          document.querySelector('.credits-logos').scrollLeft = currentElement.scrollLeft;
          document.querySelector('.credits-logos').style.overflow = 'hidden';

          if (stateOfNavbar.length === 1) {
            document.querySelector('#prev-arrow').style.display = 'none';
          }
        });

        document.querySelector('#next-arrow').addEventListener('click', (e) => {
          let firstElement = window_items[0],
            lastElement = window_items[window_items.length - 1],
            new_width = 0,
            new_window_items = [],
            prev = document.querySelector('#prev-arrow');

          if (lastElement !== max) {
            if (prev.style.display !== 'inline-block') {
              prev.style.display = 'inline-block';
            }

            for (let i = firstElement; i < max; i++) {
              console.log(document.querySelector(`.credits-links[data-item="${i}"]`))
              let element = document.querySelector(`.credits-links[data-item="${i}"]`),
                width = element.getBoundingClientRect().width;

              if ((new_width + width) <= navBarBBox.width) {
                new_width += width;
                new_window_items.push(i);
              } else {
                break;
              }
            }
            window_items = new_window_items.sort((a, b) => a - b);

            let nextElem = document.querySelector(`.credits-links[data-item="${window_items[0]}"]`),
              scrollLeft = document.querySelector('.credits-logos').scrollLeft,
              newScrollLeft = scrollLeft + nextElem.getBoundingClientRect().left;

            stateOfNavbar.push({
              window_items: window_items,
              scrollLeft: newScrollLeft
            });

            document.querySelector('.credits-logos').style.overflow = 'scroll';
            document.querySelector('.credits-logos').scrollLeft = newScrollLeft;
            document.querySelector('.credits-logos').style.overflow = 'hidden';

            if (window_items[window_items.length - 1] === max) {
              document.querySelector('#next-arrow').style.display = 'none';
            }
          }
        });
      }

    } else {
      this.setState((prevState, props) => {
        return {
          image_count: prevState.image_count + 1
        };
      });
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
      console.log("render")
      let data = this.state.dataJSON.card_data.data,
        grouped_data = this.groupBy(data.section, "title"),
        arr = [1],
        section = [];
      for (let key in grouped_data){
        let names = grouped_data[key].map((d,i) =>{
          return(
            <div className="credits-links" data-item={i} style={{display: 'inline-block'}}>
              <a href={d.url} target="_blank">
                <div className="company-name">{d.name}</div>
                <div className="company-logo"><img src={d.logo} onLoad={this.setWidth.bind(this)}/></div>
              </a>
            </div>
          )
        })
        section = section.concat(arr.map((d,i) =>{
          return(
            <div className="credits-section">
              <div className="section-title">{key}</div>
              {names}
            </div>
          )
        }))
      }
      return(
        <div className="credits-card">
          <div id="prev-arrow" className="left-click-arrow">
            <img src="arrow-left.png"/>
          </div>
          <div className="credits-logos">
            <div className="scroll-area">{section}</div>
          </div>
          <div id="next-arrow" className="right-click-arrow">
            <img src="arrow-right.png"/>
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