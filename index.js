import { initServer } from "./configs/app.js";
import  {connect } from "./configs/mongo.js"
import { insertDefaultCategory } from "./src/category/category.controller.js"
import { insertDefaultAdmin } from "./src/user/user.controller.js";


initServer()
connect()
insertDefaultCategory()
insertDefaultAdmin()