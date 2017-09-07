const pointer = event => ({x:event.clientX, y:event.clientY});
const vecaddsub = (a,b,c) => ({x:a.x+b.x-c.x, y:a.y+b.y-c.y});
const dummyImage = document.createElement('img');
dummyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const defaultOptions = {
    trigger: event => true,
    propsToPosition: props => ({x:0, y:0}),
    preservePosition: false,
}

export const Movable = (ReactComponent, options={}) => {
    options = Object.assign({}, defaultOptions, options);
    return class extends ReactComponent {
        constructor (props) {
            super(props);
            this.position = options.propsToPosition(props);
        }

        componentWillReceiveProps (nextProps) {
            if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps);
            if (!options.preservePosition) {
                this.position = options.propsToPosition(nextProps);
            }
        }

        updatePosition (position, moving, bugCut) {
            console.log(bugCut);
            if (bugCut && pointer(event).x === 0 && pointer(event).y === 0) return;
            if (this.moving && this.prevPosition) {
                this.position = vecaddsub(this.position, position, this.prevPosition);
                this.forceUpdate();
            }
            this.prevPosition = position;
            this.moving = moving;
        }

        onDragStart (event) {
            event.dataTransfer.setDragImage(dummyImage, 0, 0);
            if (options.trigger(event)) {
                this.updatePosition(pointer(event), true);
                return true;
            }
        }

        onDrag (event) {
            if (options.trigger(event) && this.moving) {
                this.updatePosition(pointer(event), true, true);
                return true;
            } else if (this.moving) {
                return true;
            }
        }

        onDragEnd (event) {
            if (options.trigger(event) && this.moving) {
                this.updatePosition(pointer(event), false);
                return true;
            } else if (this.moving) {
                this.moving = false;
                return true;
            }
        }
    }
}
