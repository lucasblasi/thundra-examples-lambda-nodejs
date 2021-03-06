const thundra = require("@thundra/core");

const CompositeSampler = thundra.samplers.CompositeSampler;
const SamplerCompositionOperator = thundra.samplers.SamplerCompositionOperator;
const CountAwareSampler = thundra.samplers.CountAwareSampler;
const DurationAwareSampler = thundra.samplers.DurationAwareSampler;
const ErrorAwareSampler = thundra.samplers.ErrorAwareSampler;
const TimeAwareSampler = thundra.samplers.TimeAwareSampler;

const config = {
    traceConfig: {
        sampler: new DurationAwareSampler(200) // Sample traces if root span takes more than 200 ms
    },
    logConfig: {
        sampler: new ErrorAwareSampler(100) // Sample logs if lambda fails
    },
    metricConfig: {
        sampler: new CountAwareSampler(10) // Sample metrics every 10th invocation
    }
};

exports.handler = thundra(config)((event, context, callback) => {
    callback(null, {msg: event.msg});
});

//////////////////////////////////////////////////////////////////
const sampler1 = new CountAwareSampler(2); // Samples every 2th.
const sampler2 = new TimeAwareSampler(3000); // Samples every 3 seconds.

// Create a composite sampler with count and time aware and combine them with AND operator, default is OR
const sampler = new CompositeSampler([sampler1, sampler2], SamplerCompositionOperator.AND)

const compositeConfig = {
    traceConfig: {
        sampler
    },
};

exports.handler_composite = thundra(compositeConfig)((event, context, callback) => {
    callback(null, {msg: event.msg});
});

//////////////////////////////////////////////////////////////////
const customSamplerConfig = {
    traceConfig: {
        sampler: {
            isSampled: (span) => {
                // Decide what to do yourself here. return true/false.
                return true;
            }
        }
    },
};

exports.handler_custom = thundra(customSamplerConfig)((event, context, callback) => {
    callback(null, {msg: event.msg});
});