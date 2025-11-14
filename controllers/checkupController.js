const checkupModel = require("../models/checkupModel");
const axios = require("axios");
const { ObjectId } = require("mongodb");

const userServices = process.env.USER_URI || `http://localhost:300`;

exports.get = function (req, res, next) {
  const {
    id,
    nik,
    createdAt,
    startDate,
    endDate,
    status,
    createBy,
    updatedAt,
    monthly,
  } = req.query;
  let query = {};
  if (id) {
    query = { ...query, _id: ObjectId(id) };
  }
  if (nik) {
    query = { ...query, "profile.idNumber": nik };
  }
  if (createBy) {
    query = { ...query, "createBy._id": createBy };
  }
  if (monthly) {
    query = { ...query, monthly };
  }
  if (createdAt) {
    query = { ...query, created: createdAt };
  }

  if (startDate && endDate) {
    query = {
      ...query,
      created: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  } else if (startDate) {
    query = {
      ...query,
      created: {
        $gte: startDate,
      },
    };
  } else if (endDate) {
    query = {
      ...query,
      created: {
        $lte: endDate,
      },
    };
  }

  if (updatedAt) {
    query = { ...query, updatedAt };
  }
  if (status) {
    query = { ...query, status };
  }

  checkupModel.aggregate(
    [
      {
        $addFields: {
          created: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          monthly: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
        },
      },
      {
        $match: query,
      },
    ],
    (err, result) => {
      if (err) {
        next();
      } else {
        res.status(200).json(result);
      }
    }
  );
};

exports.getMany = function (req, res, next) {
  const { nik, createdAt } = req.query;
  let query = {};
  if (nik) {
    if (Array.isArray(nik)) {
      query = { ...query, "profile.idNumber": { $in: nik } };
    } else {
      query = { ...query, "profile.idNumber": nik };
    }
  }
  if (createdAt) {
    query = { ...query, created: createdAt };
  }

  checkupModel.aggregate(
    [
      {
        $addFields: {
          created: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          monthly: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
        },
      },
      {
        $match: query,
      },
    ],
    (err, result) => {
      if (err) {
        next();
      } else {
        res.status(200).json(result);
      }
    }
  );
};

exports.getCount = function (req, res, next) {
  const { id, nik, createdAt, status, createBy, updatedAt, monthly } =
    req.query;
  let query = {};
  if (id) {
    query = { ...query, _id: ObjectId(id) };
  }
  if (nik) {
    query = { ...query, "profile.idNumber": nik };
  }
  if (createBy) {
    query = { ...query, "createBy._id": createBy };
  }
  if (monthly) {
    query = { ...query, monthly };
  }
  if (createdAt) {
    query = { ...query, created: createdAt };
  }
  if (updatedAt) {
    query = { ...query, updatedAt };
  }
  if (status) {
    query = { ...query, status };
  }

  checkupModel.aggregate(
    [
      {
        $addFields: {
          createdAt: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          monthly: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          yearly: {
            $dateToString: {
              format: "%Y",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
        },
      },
      {
        $match: query,
      },
      {
        $addFields: {
          fittowork: {
            $cond: {
              if: { $eq: ["$status", "1"] },
              then: 1,
              else: 0,
            },
          },
          fittoworkwithnote: {
            $cond: {
              if: { $eq: ["$status", "2"] },
              then: 1,
              else: 0,
            },
          },
          unfittowork: {
            $cond: {
              if: { $eq: ["$status", "3"] },
              then: 1,
              else: 0,
            },
          },
          retake1: {
            $cond: {
              if: { $eq: ["$status", "4"] },
              then: 1,
              else: 0,
            },
          },
          retake2: {
            $cond: {
              if: { $eq: ["$status", "5"] },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: 1,
          fittowork: { $sum: "$fittowork" },
          fittoworkwithnote: { $sum: "$fittoworkwithnote" },
          unfittowork: { $sum: "$unfittowork" },
          retake1: { $sum: "$retake1" },
          retake2: { $sum: "$retake2" },
          semua: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: "$_id",
          fittowork: "$fittowork",
          fittoworkwithnote: "$fittoworkwithnote",
          unfittowork: "$unfittowork",
          retake1: "$retake1",
          retake2: "$retake2",
          createdAt: "$createdAt",
          monthly: "$monthly",
          yearly: "$yearly",
        },
      },
    ],
    (err, result) => {
      if (err) {
        next();
      } else {
        res.status(200).json(result);
      }
    }
  );
};

exports.getHistory = function (req, res, next) {
  const { idTrainDriver, idCheckUp } = req.query;
  let query = {
    "trainDriver._id": idTrainDriver,
    "mrData.dataDetails._id": idCheckUp,
  };

  checkupModel
    .aggregate(
      [
        {
          $unwind: "$mrData",
        },
        {
          $unwind: "$mrData.dataDetails",
        },
        {
          $match: query,
        },
        {
          $project: {
            mrData: "$mrData.dataDetails.name",
            mrDataUnit: "$mrData.dataDetails.unit",
            mrDataNote: "$mrData.dataDetails.note",
            mrDataAnswer: "$mrData.dataDetails.answer",
            createAt: "$createdAt",
            status: 1,
          },
        },
        {
          $addFields: {
            created: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "+07:00",
              },
            },
          },
        },
        {
          $sort: {
            createAt: -1,
          },
        },
      ],
      (err, result) => {
        if (err) {
          next();
        } else {
          res.status(200).json(result);
        }
      }
    )
    .limit(100);
};

async function insertDataToAMS(user_id, token) {
  try {
    const res_insert = await axios.post(
      `${process.env.OPERATIONAL_OCC_URI}/api/auth/user/createmedical`,
      { user_id },
      { headers: { token } }
    );
    console.log("res_insert", res_insert.data);
    if (res_insert?.data?.result) {
      await axios.post(
        `${process.env.OPERATIONAL_OCC_URI}/api/auth/user/approvalscanmedic`,
        { head_id: res_insert?.data?.header_id },
        { headers: { token } }
      );
    }
    return res_insert?.data?.header_id;
    // update user_id in profile
  } catch (error) {
    console.log("error update user ams ", error);
  }
}

async function updateDataToAMS(
  head_id,
  checkup_answers,
  summary_note,
  summary_id,
  category_summary,
  token
) {
  try {
    await axios.post(
      `${process.env.OPERATIONAL_OCC_URI}/api/auth/user/answermedic`,
      { head_id, checkup_answers, summary_note, summary_id, category_summary },
      { headers: { token } }
    );

    // update user_id in profile
  } catch (error) {
    console.log("error update user ams ", error);
  }
}

exports.create = function (req, res, next) {
  let sendData = { ...req.body };
  let query = {};
  if (sendData?._id) {
    query = { ...query, _id: ObjectId(sendData?._id) };
  }
  if (sendData?.profile?.idNumber) {
    query = {
      ...query,
      "profile.idNumber": sendData?.profile?.idNumber,
    };
  }
  if (sendData?.dailyWorkOrder?.workOrder?.code) {
    query = {
      ...query,
      "dailyWorkOrder.workOrder.code": sendData?.dailyWorkOrder.workOrder?.code,
    };
  }
  if (sendData?.createdAt) {
    query = {
      ...query,
      created: sendData?.createdAt,
    };
  }
  console.log("query=======>", query);

  checkupModel.aggregate(
    [
      {
        $addFields: {
          created: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
        },
      },
      {
        $match: query,
      },
    ],
    async (err, result) => {
      if (err) {
        next();
      } else {
        if (result.length > 0) {
          if (result.length === 1) {
            res.status(200).json(result[0]);
          } else {
            res.status(200).json(result);
          }
        } else {
          // Insert Data To AMS
          const user_id = sendData?.profile?.user_id;
          const token = req.headers["token-ams"];
          const head_id = await insertDataToAMS(user_id, token);
          console.log("user_id", user_id, token);

          //-----------------

          let newData = { ...sendData, head_id, createdAt: new Date() };

          var new_data = new checkupModel(newData);
          new_data.save(async function (err, data) {
            if (err) {
              next(err);
            } else {
              // generate true -> update attendance
              // let profileId = sendData?.profile?._id
              // let getOperational = await axios.get(
              //     "http://localhost:600/scheduletraindriver?trainDriverId=" +
              //         trainDriverId
              // )
              // let resdataoperational = await getOperational
              //     ?.data[0]

              // let updateAtendance = await axios.put(
              //     "http://localhost:600/scheduletraindriver/" +
              //         resdataoperational?._id,
              //     {
              //         attendace: {
              //             attendanceTime: new Date()
              //         }
              //     }
              // )

              // if (updateAtendance?.status == 200) {
              res.status(200).json(data);
              // } else {
              //     next()
              // }
            }
          });
        }
      }
    }
  );
};

exports.update = async function (req, res, next) {
  const { id, nik } = req.query;
  let query = {};
  if (id) {
    query = { ...query, _id: id };
  }
  if (nik) {
    query = { ...query, "profile.idNumber": nik };
  }

  var updateCheckup = await checkupModel.findOne({ _id: req.params._id });
  let updatedata = {
    changeDate: updateCheckup.changeDate,
    changeDate: updateCheckup.changeData,
  };
  for (let key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      if (updateCheckup[key] !== req.body[key]) {
        updatedata = { ...updatedata, [key]: updateCheckup[key] };
      }
    }
  }

  // res.status(200).json(checkup_answers)
  var dataupdate = {
    ...req.body,
    changeDate: new Date(),
    changeData: updatedata,
  };
  checkupModel.findOneAndUpdate(
    req.params._id ? { _id: req.params._id } : query,
    //req.body,
    dataupdate,
    { new: true },
    async (err, data) => {
      if (err) {
        next(err);
      } else {
        let checkup_answers = {};
        req.body.mrData.map((x) => {
          x.dataDetails.map((y) => {
            if (y.soal_id) {
              checkup_answers[y.soal_id] = {
                jawaban: y?.answer?.value,
                note: y.note,
              };
            }
          });
        });
        console.log(
          "checkup_answers",
          data.head_id,
          checkup_answers,
          "",
          data.status
        );
        const token = req.headers["token-ams"];
        await updateDataToAMS(
          data.head_id,
          checkup_answers,
          "",
          data.status,
          {
            "634bb49c3895999e758070c8": 1,
            "634bb49c3895899e758070c8": 1,
          },
          token
        );
        res.status(200).json(data);
      }
    }
  );
};

exports.delete = function (req, res, next) {
  checkupModel.findOneAndDelete({ _id: req.params._id }, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json(data);
    }
  });
};

exports.getSummaryCount = function (req, res, next) {
  const { id, nik, createdAt, status, createBy, updatedAt, monthly } =
    req.query;
  let query = {};
  if (id) {
    query = { ...query, _id: ObjectId(id) };
  }
  if (nik) {
    query = { ...query, "trainDriver.nik": nik };
  }
  if (createBy) {
    query = { ...query, "createBy._id": createBy };
  }
  if (monthly) {
    query = { ...query, monthly };
  }
  if (createdAt) {
    query = { ...query, created: createdAt };
  }
  if (updatedAt) {
    query = { ...query, updatedAt };
  }
  if (status) {
    query = { ...query, status };
  }

  checkupModel.aggregate(
    [
      { $match: query },
      {
        $addFields: {
          fitwork: {
            $cond: {
              if: { $eq: ["$status", "1"] },
              then: 1,
              else: 0,
            },
          },
          fitworknote: {
            $cond: {
              if: { $eq: ["$status", "2"] },
              then: 1,
              else: 0,
            },
          },
          unfitwork: {
            $cond: {
              if: { $eq: ["$status", "3"] },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          fitwork: { $sum: "$fitwork" },
          fitworknote: { $sum: "$fitworknote" },
          unfitwork: { $sum: "$unfitwork" },
          semua: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          fitwork: "$fitwork",
          fitworknote: "$fitworknote",
          unfitwork: "$unfitwork",
          semua: "$semua",
        },
      },
    ],
    (err, result) => {
      if (err) {
        next();
      } else {
        res.status(200).json(result);
      }
    }
  );
};

exports.getDashboard = function (req, res, next) {
  const { id, type, value } = req.query;
  let query = {};
  if (id) {
    query = { ...query, _id: ObjectId(id) };
  }
  if (type && value) {
    query =
      type === "year"
        ? { ...query, year: value }
        : type === "monthly"
        ? { ...query, monthly: value }
        : { ...query, createdAt: value };
  }
  checkupModel.aggregate(
    [
      {
        $addFields: {
          createdAt: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          monthly: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          year: {
            $dateToString: {
              format: "%Y",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
        },
      },
      { $match: query },

      {
        $addFields: {
          fitwork: {
            $cond: {
              if: { $eq: ["$status", "1"] },
              then: 1,
              else: 0,
            },
          },
          fitworknote: {
            $cond: {
              if: { $eq: ["$status", "2"] },
              then: 1,
              else: 0,
            },
          },
          unfitwork: {
            $cond: {
              if: { $eq: ["$status", "3"] },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: type === "year" ? "$monthly" : "$createdAt",
          fitwork: { $sum: "$fitwork" },
          fitworknote: { $sum: "$fitworknote" },
          unfitwork: { $sum: "$unfitwork" },
          semua: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          fitwork: "$fitwork",
          fitworknote: "$fitworknote",
          unfitwork: "$unfitwork",
          semua: "$semua",
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
    (err, result) => {
      if (err) {
        next();
      } else {
        res.status(200).json(result);
      }
    }
  );
};
