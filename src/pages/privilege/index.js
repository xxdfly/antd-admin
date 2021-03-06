import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Modal from './components/Modal'
import CreateButton from './components/createButton'

@withI18n()
@connect(({ privilege, loading}) => ({ privilege, loading }))
class RepositoryPage extends PureComponent {

  render() {
    const { location, dispatch, privilege, loading, i18n } = this.props
    const { query, pathname } = location
    const {
      list,
      currentItem,
      modalVisible,
      modalType,
    } = privilege

    const handleRefresh = newQuery => {
      router.push({
        pathname,
        search: stringify(
          {
            ...query,
            ...newQuery,
          },
          { arrayFormat: 'repeat' }
        ),
      })
    }

    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[`privilege/${modalType}`],
      title: `${
        modalType === 'create' ? i18n.t`Create Privilege` : i18n.t`Update Privilege`
      }`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `privilege/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'privilege/hideModal',
        })
      },
    }

    const listProps = {
      dataSource: list,
      loading: loading.effects['privilege/query'],
      onDeleteItem(id) {
        dispatch({
          type: 'privilege/delete',
          payload: id,
        }).then(() => {

        })
      },
      onEditItem(item) {
        dispatch({
          type: 'privilege/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
    }

    const buttonProps = {
      onAdd() {
        dispatch({
          type: 'privilege/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }

    return (
      <Page inner>
        <Row gutter={24}>
          <CreateButton {...buttonProps} />
          <List {...listProps} />
          {modalVisible && <Modal {...modalProps} />}
        </Row>
      </Page>
    )
  }
}

RepositoryPage.propTypes = {
  privilege: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default RepositoryPage
