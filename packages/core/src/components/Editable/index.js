// @flow
import React, { Component } from 'react'
import { Provider } from 'react-redux'

import DragDropContext from '../DragDropContext'
import HotKeyDecorator from '../HotKey/Decorator'
import { updateEditable } from '../../actions/editables'
import { editable } from '../../selector/editable'
import PluginService from '../../service/plugin'
import Inner from './Inner'

import type { Store } from 'types/redux'
import type { Editable as EditableType } from 'types/editable'

class Editable extends Component {
  componentDidMount() {
    if (!this.props.id) {
      throw new Error('The state must have an unique id')
    }

    this.props.editor.store.subscribe(this.onChange)
    this.previousState = null
  }

  previousState: any = {}

  props: {
    id: string,
    editor: {
      plugins: PluginService,
      store: Store
    },
    onChange?: Function
  }

  onChange = () => {
    if (typeof this.props.onChange !== 'function') {
      return
    }
    const onChange = this.props.onChange || (() => ({}))

    const state: any = editable(this.props.editor.store.getState(), { id: this.props.id })
    if (state === this.previousState) {
      return
    }

    const serialized = this.props.editor.plugins.serialize(state)
    onChange(serialized)
  }

  render() {
    const {
      id,
      editor: {
        store
      },
    } = this.props

    return (
      <Provider store={store}>
        <DragDropContext>
          <HotKeyDecorator id={id}>
            <Inner id={id} />
          </HotKeyDecorator>
        </DragDropContext>
      </Provider>
    )
  }
}

export default Editable