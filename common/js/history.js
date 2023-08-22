export const switchReview = (data) => {
  const {
    event_where,
    event_action,
    location_translate_name2: location,
    translate_store_name: store_name,
    translate_store_branch_name: branch_name,
    translate_product_name: product,
    translate_promotion_name: promotion,
    translate_theme_name: theme,
  } = data
  const store = store_name+branch_name

  const target = {
    store: {
      index: '正在搜索'+location+'的商户。',
      show: '您去过'+location+store+'。',
    },
    product: {
      index: '您当前在查阅'+store+location+'的菜单。',
      show: '您当前在查阅'+location+store+'的'+product+'。',
    },
    order: {
      cancel: location+'中'+store+'中的'+product+'预订取消了。',
      cancel_partitial: location+'中'+store+'中的'+product+'预订取消了。',
      store: location+'中'+store+'中的'+product+'预订取消了。',
    },
    cart: {
      store: location+'中'+store+'中的'+product+'加入了购物车。',
      update: location+'中'+store+'中的'+product+'购物车中的数量改变了。',
    },
    promotion: {
      index: '正在查阅活动。',
      show: '正在查阅'+promotion+'。',
    },
    theme: {
      index: '正在查阅主题。',
      show: '正在查阅'+theme+'。',
    },
  }

  const message = !target[event_where]
    ? null
    : target[event_where][event_action]
  return message
}
