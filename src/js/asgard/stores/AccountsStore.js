import {EventEmitter} from "events";

import AppDispatcher from "../../AppDispatcher";
import AccountsEvents from "../events/UserEvents";
import Util from "../../helpers/Util";

const storeData = {
  accounts: [],
};

var AccountsStore = Util.extendObject(EventEmitter.prototype, {
  get accounts() {
    return Util.deepCopy(storeData.accounts);
  },
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AccountsEvents.REQUEST:
      AccountsStore.emit(AccountsEvents.CHANGE);
      break;
    case AccountsEvents.REQUEST_ERROR:
      AccountsStore.emit(
        AccountsEvents.REQUEST_ERROR,
        action.data.body,
        action.data.status
      );
      break;
  }
});

export default AccountsStore;
