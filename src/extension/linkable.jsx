const pointer = event => ({x:event.clientX, y:event.clientY});

const POINTER_END_ID  = "react-graph-diagram::POINTER_END_ID";
const POINTER_EDGE_ID = "react-graph-diagram::POINTER_EDGE_ID";
const defaultOptions = {
    linkEndType: 'nodes',
    newLinkEnd: position => ({id:POINTER_END_ID, position}),
    newLinkEdge: (src,dst) => ({id:POINTER_EDGE_ID, ends:{src,dst}}),
}
export const Linkable = (ReactComponent, options={}) => {
    options = Object.assign({}, defaultOptions, options);
    return class extends ReactComponent {
        constructor (props) {
            super(props);
            this.linkEnd  = null;
            this.linkEdge = null;
        }

        prepareGraph () {
            if (this.linkEnd) {
                this[options.linkEndType] = this[options.linkEndType].concat(this.linkEnd);
            }
            if (this.linkEdge) {
                this.edges = this.edges.concat(this.linkEdge);
            }
        }

        onLinkStart (event, src) {
            const position = pointer(event);
            this.linkEnd  = options.newLinkEnd(position);
            this.linkEdge = options.newLinkEdge(src, this.linkEnd);
            this.prepareGraph();
            this.forceUpdate(() => this.refs[this.linkEnd.id].updatePosition(position, true));
        }

        onLink (event) {
            const position = pointer(event);
            if (!this.linkEnd) {
                console.error('Link not started.')
            } else if (!this.refs[this.linkEnd.id]) {
                this.forceUpdate(() => {
                    this.refs[this.linkEnd.id].updatePosition(position, true)
                });
            } else {
                this.refs[this.linkEnd.id].updatePosition(position, true)
            }
        }

        onLinkEnd (event) {
            this.linkEnd  = null;
            this.linkEdge = null;
            this.prepareGraph();
            this.forceUpdate();
        }
    }
}
