import React from 'react';
import ReactDOM from 'react-dom';
import CreditCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toCreditPartners = function () {
  this.cardType = 'toCreditPartners';
}

ProtoGraph.Card.toCreditPartners.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toCreditPartners.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toCreditPartners.prototype.renderCol16= function (data) {
  this.mode = 'col16';
  this.render();
}

ProtoGraph.Card.toCreditPartners.prototype.renderCol7= function (data) {
  this.mode = 'col7';
  this.render();
}

ProtoGraph.Card.toCreditPartners.prototype.renderCol4= function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.toCreditPartners.prototype.render = function () {
  ReactDOM.render(
    <CreditCard
      dataURL={this.options.data_url}
      selector={this.options.selector}
      clickCallback={this.options.onClickCallback}
      mode={this.mode}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }} />,
    this.options.selector);
}