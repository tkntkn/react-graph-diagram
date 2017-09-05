import {pointer, vecaddsub, dummyImage} from './utils';

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

        updatePosition (position, moving) {
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
                if (pointer(event).x === 0 && pointer(event).y === 0) return;
                this.updatePosition(pointer(event), true);
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
