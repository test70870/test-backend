const AWS = require('aws-sdk');
const constant = require("../constants/constant");
const fs = require("fs");
const get_AWS = new AWS.S3(constant.awsCredentials);
// import { constant } from "../constants/constant";

exports.getSignedUrlS3 = async (s3FilePath) => {
  const originalUrl = s3FilePath.split("/").pop();
  let relativeUrl = s3FilePath.split("amazonaws.com");
  relativeUrl = relativeUrl[1].replace("/" + originalUrl, "");

  const params = {
    Bucket: constant.awsCredentials.bucketName,
    Key: originalUrl,
  };

  let paramsToFetch = {
    Bucket: constant.awsCredentials.bucketName,
    Key: originalUrl,
    Expires: 604800,
  };

  const headCode = await get_AWS
    .headObject(params)
    .promise()
    .then(
      () => true,
      (err) => {
        if (err) {
          return false;
        }
      }
    );

  if (!headCode) {
    paramsToFetch = {
      Bucket: constant.awsCredentials.bucketName + relativeUrl,
      Key: originalUrl,
      Expires: 604800,
    };
  }
  const url = await get_AWS.getSignedUrl("getObject", paramsToFetch);
  return url;
}

exports.downloadMediaFromS3 = async () => {
  try{
    const fsPro = require('fs/promises');
    const dir = './uploads/';
    const mediaUrl = 'https://mediacardmetaverse.s3.us-east-2.amazonaws.com/nftAssetImages/1669616204635_primary_asset.mp4';
    const mediaUrlArray = mediaUrl.split("/");
    const key = mediaUrlArray[mediaUrlArray.length - 2] + '/' + mediaUrlArray[mediaUrlArray.length - 1];
    const base_image = mediaUrlArray[mediaUrlArray.length - 1];
    const params = {
      Bucket: constant.awsCredentials.bucketName,
      Key: key
    };
    const file = await get_AWS.getObject(params).promise();
    const base_image_new_name = Date.now().toString() + 'downloaded_media' + base_image;
    await fsPro.writeFile(dir + base_image_new_name, file.Body);
    return `uploads/${base_image_new_name}`;
  } catch (error) {
    console.log(error, "    error");
    throw "error";
  }

}
