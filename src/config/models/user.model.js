import mongoose from "mongoose";

export const roleenum = { user: "user", admin: "admin" };
export const providerenum = { system: "system", google: "google" };
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
      maxlength: [50, "First name must be less than 50 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 characters long"],
      maxlength: [50, "Last name must be less than 50 characters"],
    },
    role: {
      type: String,
      enum: Object.values(roleenum),
      default: roleenum.user,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providerenum.system ? true : false;
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
    },
    coverImages: {
      type: [String],
    },
    provider: {
      type: String,
      enum: Object.values(providerenum),
      default: providerenum.system,
    },
    confirmEmailOtp: {
      type: String,
      default: null,
    },
    changePasswordAt: { type: Date },

    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredAt: { type: Date },
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    forgetPassOTP: { type: String },

    changeCredentialsTime: { type: Date },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: true,
  },
);

userSchema
  .virtual("fullName")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

// sync indexes
UserModel.syncIndexes();
