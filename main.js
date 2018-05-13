import React from 'react';
import ReactDOM from 'react-dom';
import CreditCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toCredits = function () {
  this.cardType = 'toCredits';
}

ProtoGraph.Card.toCredits.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toCredits.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toCredits.prototype.renderSixteenCol= function (data) {
  this.mode = 'col16';
  this.render();
}

ProtoGraph.Card.toCredits.prototype.renderFourCol= function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.toCredits.prototype.render = function () {
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